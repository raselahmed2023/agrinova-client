import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";

const client = new MongoClient(process.env.MONGODB_URL as string);
const db = client.db("AgriNove-auth");

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      // Role Management (FARMER, EXPERT, ADMIN)
      role: {
        type: "string",
        defaultValue: "FARMER",
        required: false,
      },
      // Approval Status (Farmers auto-approved, Experts "PENDING")
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
});