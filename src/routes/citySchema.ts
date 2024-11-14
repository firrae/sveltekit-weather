import { z } from "zod";

// Form schema for the city search
export const cityFormSchema = z.object({
    country: z.string().min(2).max(3),
    province: z.string().min(2).max(3),
    city: z.string().min(2).max(50),
    units: z.enum(["imperial", "metric", "standard"]).optional().default("imperial"),
});

export type FormSchema = typeof cityFormSchema;