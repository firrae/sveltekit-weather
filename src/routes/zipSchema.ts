import { z } from "zod";

export const zipFormSchema = z.object({
    zipCode: z.string().min(2).max(10),
    country: z.string().min(2).max(3),
    units: z.enum(["imperial", "metric", "standard"]).optional().default("imperial"),
});

export type FormSchema = typeof zipFormSchema;