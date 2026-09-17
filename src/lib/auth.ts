import {
  betterAuth,
} from "better-auth";

import {
  MongoClient,
} from "mongodb";

import {
  mongodbAdapter,
} from "better-auth/adapters/mongodb";

import {
  jwt,
} from "better-auth/plugins";

import {
  after,
} from "next/server";

import {
  sendPasswordResetEmail,
} from "@/lib/email";

/* ============================================================
   ENVIRONMENT
============================================================ */

const mongoUrl =
  process.env.MONGODB_URL;

if (
  !mongoUrl
) {
  throw new Error(
    "MONGODB_URL is not configured"
  );
}

/* ============================================================
   MONGODB CLIENT
============================================================ */

const globalForMongo =
  globalThis as unknown as {
    mongoClient?:
      MongoClient;
  };

const client =
  globalForMongo.mongoClient ??
  new MongoClient(
    mongoUrl
  );

if (
  process.env.NODE_ENV !==
  "production"
) {
  globalForMongo.mongoClient =
    client;
}

/* ============================================================
   AUTH DATABASE

   Exported because some API routes, including
   expert-application, directly access auth collections.
============================================================ */

export const authDb =
  client.db(
    "AgriNove-auth"
  );

/* ============================================================
   BETTER AUTH
============================================================ */

export const auth =
  betterAuth({
    /* ========================================================
       EMAIL + PASSWORD
    ======================================================== */

    emailAndPassword: {
      enabled:
        true,

      minPasswordLength:
        8,

      maxPasswordLength:
        128,

      /* ======================================================
         PASSWORD RESET TOKEN

         60 minutes
      ====================================================== */

      resetPasswordTokenExpiresIn:
        60 *
        60,

      /* ======================================================
         SECURITY

         When password changes, old sessions are revoked.
      ====================================================== */

      revokeSessionsOnPasswordReset:
        true,

      /* ======================================================
         SEND PASSWORD RESET EMAIL
      ====================================================== */

      sendResetPassword:
        async ({
          user,
          url,
        }) => {
          /*
           * Send email after response.
           *
           * This avoids making the reset-request response
           * unnecessarily dependent on Resend response time.
           */
          after(
            async () => {
              try {
                await sendPasswordResetEmail(
                  {
                    to:
                      user.email,

                    name:
                      user.name,

                    resetUrl:
                      url,
                  }
                );
              } catch (
                error
              ) {
                /*
                 * Do not expose Resend/internal email
                 * provider errors to the browser.
                 */
                console.error(
                  "Failed to send password reset email:",
                  error
                );
              }
            }
          );
        },

      /* ======================================================
         AFTER PASSWORD RESET
      ====================================================== */

      onPasswordReset:
        async ({
          user,
        }) => {
          console.log(
            "Password reset completed for user:",
            user.id
          );
        },
    },

    /* ========================================================
       USER FIELDS
    ======================================================== */

    user: {
      additionalFields: {
        /* ====================================================
           ROLE

           FARMER
           ADMIN
           EXPERT
        ==================================================== */

        role: {
          type:
            "string",

          defaultValue:
            "FARMER",

          required:
            false,
        },

        /* ====================================================
           ACCOUNT / EXPERT STATUS

           APPROVED
           PENDING
           REJECTED
        ==================================================== */

        status: {
          type:
            "string",

          defaultValue:
            "APPROVED",

          required:
            false,
        },

        /* ====================================================
           PHONE
        ==================================================== */

        phone: {
          type:
            "string",

          required:
            false,
        },

        /* ====================================================
           EXPERT PROFILE
        ==================================================== */

        specialization: {
          type:
            "string",

          required:
            false,
        },

        experienceYears: {
          type:
            "number",

          required:
            false,
        },

        qualification: {
          type:
            "string",

          required:
            false,
        },

        /* ====================================================
           PROFILE IMAGE
        ==================================================== */

        avatar: {
          type:
            "string",

          required:
            false,
        },
      },
    },

    /* ========================================================
       DATABASE
    ======================================================== */

    database:
      mongodbAdapter(
        authDb,
        {
          client,
        }
      ),

    /* ========================================================
       JWT
    ======================================================== */

    plugins: [
      jwt({
        jwt: {
          expirationTime:
            "15m",

          definePayload:
            ({
              user,
            }) => {
              const appUser =
                user as typeof user & {
                  role?:
                    string;

                  status?:
                    string;

                  phone?:
                    string;

                  specialization?:
                    string;

                  experienceYears?:
                    number;

                  qualification?:
                    string;

                  avatar?:
                    string;
                };

              return {
                id:
                  user.id,

                email:
                  user.email,

                name:
                  user.name,

                role:
                  appUser.role ||
                  "FARMER",

                status:
                  appUser.status ||
                  "APPROVED",

                phone:
                  appUser.phone,

                specialization:
                  appUser.specialization,

                experienceYears:
                  appUser.experienceYears,

                qualification:
                  appUser.qualification,

                avatar:
                  appUser.avatar,
              };
            },
        },
      }),
    ],
  });