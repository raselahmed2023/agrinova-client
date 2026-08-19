import { z } from "zod";

// 1. Login Schema
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// 2. Base Fields for Registration
const baseRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms of Service and Privacy Policy",
  }),
});

// 3. Normal Farmer Register Schema
export const registerSchema = baseRegisterSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

// 4. Expert Base Object
const expertRegisterObject = baseRegisterSchema.extend({
  specialization: z.string().min(2, "Specialization is required"),
  experienceYears: z.coerce.number().min(1, "Experience must be at least 1 year"),
  qualification: z.string().min(2, "Qualification details are required"),
});

// 5. Expert Register Schema
export const expertRegisterSchema = expertRegisterObject.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  }
);

// Types Export
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof baseRegisterSchema>;
export type ExpertRegisterInput = z.infer<typeof expertRegisterObject>;