import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const mongoUrl = process.env.MONGODB_URL;

if (!mongoUrl) {
  throw new Error("MONGODB_URL is not configured");
}

const globalForMongo = globalThis as unknown as {
  mongoClient?: MongoClient;
};

const client =
  globalForMongo.mongoClient ??
  new MongoClient(mongoUrl);

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = client;
}

const db = client.db("AgriNove-auth");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "FARMER",
        required: false,
      },

      status: {
        type: "string",
        defaultValue: "APPROVED",
        required: false,
      },

      phone: {
        type: "string",
        required: false,
      },

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