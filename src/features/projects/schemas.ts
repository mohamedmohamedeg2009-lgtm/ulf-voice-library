import { z } from "zod";

export const projectInputSchema = z.object({
  name: z.string().trim().min(1, "اسم المشروع مطلوب").max(100),
  description: z.string().trim().max(500).default(""),
});

export const projectSchema = projectInputSchema.extend({
  id: z.uuid(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});

export type Project = z.infer<typeof projectSchema>;
