import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(
  process.env.MONGODB_URL as string
);

const db = client.db("AgriNove-auth");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      // Role Management
      role: {
        type: "string",
        defaultValue: "FARMER",
        required: false,
      },

      // Approval Status
      status: {
        type: "string",
        defaultValue: "APPROVED",
        required: false,
      },

      // Contact & Profile
      phone: {
        type: "string",
        required: false,
      },

      // Expert Specific Profile Fields
      specialization: {
        type: "string",
        required: false,
      },

      experienceYears: {
        type: "number",
        required: false,
      },

      qualification: {
        type: "string",
        required: false,
      },
    },
  },

  database: mongodbAdapter(db, {
    client,
  }),

  plugins: [
    jwt({
      jwt: {
        expirationTime: "15m",

        definePayload: ({ user }) => {
          const appUser = user as typeof user & {
            role?: string;
            status?: string;
          };

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: appUser.role || "FARMER",
            status: appUser.status || "APPROVED",
          };
        },
      },
    }),
  ],
});