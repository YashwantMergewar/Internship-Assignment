import { z } from "zod";

export const userRegistrationSchema = z.object({
  firstname: z
    .string()
    .min(3, "Firstname must be at least 3 characters long")
    .max(100, "Firstname must be at most 100 charcters long")
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Firstname can only contain letters and spaces",
    }),

  lastname: z
    .string()
    .min(3, "Lastname must be at least 3 characters long")
    .max(100, "Lastname must be at most 100 charcters long")
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Lastname can only contain letters and spaces",
    }),

  email: z.string().email({ message: "Invalid email address" }),

  mobile: z
    .string()
    .trim()
    .transform((val) => val.replace(/\D/g, ""))
    .refine(
      (val) => {
        const mobile = val.startsWith("91") ? val.slice(2) : val;
        return /^[6-9]\d{9}$/.test(mobile);
      },
      {
        message: "Invalid Indian mobile number",
      },
    )
    .transform((val) => {
      const mobile = val.startsWith("91") ? val.slice(2) : val;
      return `+91${mobile}`; // normalized format
    }),

  gender: z.enum(["male", "female", "other"]),

  status: z.enum(["active", "inactive"]),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters long")
    .max(100, "Location must be at most 100 characters long"),
});

export const userUpdateSchema = z.object({
 firstname: z
    .string()
    .min(3, "Firstname must be at least 3 characters long")
    .max(100, "Firstname must be at most 100 charcters long")
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Firstname can only contain letters and spaces",
    }).optional(),

  lastname: z
    .string()
    .min(3, "Lastname must be at least 3 characters long")
    .max(100, "Lastname must be at most 100 charcters long")
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Lastname can only contain letters and spaces",
    }).optional(),

  email: z.string().email({ message: "Invalid email address" }).optional(),

  mobile: z
    .string()
    .trim()
    .transform((val) => val.replace(/\D/g, ""))
    .refine(
      (val) => {
        const mobile = val.startsWith("91") ? val.slice(2) : val;
        return /^[6-9]\d{9}$/.test(mobile);
      },
      {
        message: "Invalid Indian mobile number",
      },
    )
    .transform((val) => {
      const mobile = val.startsWith("91") ? val.slice(2) : val;
      return `+91${mobile}`; // normalized format
    }).optional(),

  gender: z.enum(["male", "female", "other"]).optional(),

  status: z.enum(["active", "inactive"]).optional(),

  location: z
    .string()
    .min(3, "Location must be at least 3 characters long")
    .max(100, "Location must be at most 100 characters long").optional(),
});
