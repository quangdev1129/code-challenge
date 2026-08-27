import { z } from "zod";

export const CreateResourceSchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name must be at most 255 characters"),
  description: z.string().optional(),
  categoryId: z.string().uuid("categoryId must be a valid UUID"),
  tagIds: z.array(z.string().uuid("Each tagId must be a valid UUID")).optional(),
});

export const UpdateResourceSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  categoryId: z.string().uuid("categoryId must be a valid UUID").optional(),
  tagIds: z.array(z.string().uuid("Each tagId must be a valid UUID")).optional(),
});

export const ResourceFilterSchema = z.object({
  name: z.string().optional(),
  categoryId: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type CreateResourceDto = z.infer<typeof CreateResourceSchema>;
export type UpdateResourceDto = z.infer<typeof UpdateResourceSchema>;
export type ResourceFilter = z.infer<typeof ResourceFilterSchema>;
