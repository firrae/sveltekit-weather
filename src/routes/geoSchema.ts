import { z } from "zod";

// Form schema for the geo coords search
export const geoFormSchema = z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    units: z.enum(["imperial", "metric", "standard"]).optional().default("imperial"),
});

export type FormSchema = typeof geoFormSchema;