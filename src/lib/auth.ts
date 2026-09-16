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

const mongoUrl =
  process.env.MONGODB_URL;

if (!mongoUrl) {
  throw new Error(
    "MONGODB_URL is not configured"
  );
}

const globalForMongo =
  globalThis as unknown as {
    mongoClient?: MongoClient;
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

export const authDb =
  client.db(
    "AgriNove-auth"
  );

export const auth =
  betterAuth({
    emailAndPassword: {
      enabled: true,
      minPasswordLength:
        6,

      maxPasswordLength:
        128,

      resetPasswordTokenExpiresIn:
        60 * 60,

      
      revokeSessionsOnPasswordReset:
        true,

      sendResetPassword:
        async ({
          user,
          url,
        }) => {
         
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
                console.error(
                  "Password reset email failed:",
                  error
                );
              }
            }
          );
        },

      onPasswordReset:
        async ({
          user,
        }) => {
          console.info(
            `Password reset completed for user ${user.id}`
          );
        },
    },

    user: {
      additionalFields: {
        
        role: {
          type:
            "string",

          defaultValue:
            "FARMER",

          required:
            false,

          input:
            false,
        },

        status: {
          type:
            "string",

          defaultValue:
            "APPROVED",

          required:
            false,

          input:
            false,
        },

        phone: {
          type:
            "string",

          required:
            false,
        },

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

        avatar: {
          type:
            "string",

          required:
            false,
        },
      },
    },

    database:
      mongodbAdapter(
        authDb,
        {
          client,
        }
      ),

    plugins: [
      jwt({
        jwt: {
          expirationTime:
            "15m",

          definePayload: ({
            user,
          }) => {
            const appUser =
              user as typeof user & {
                role?:
                  string;

                status?:
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
            };
          },
        },
      }),
    ],
  });