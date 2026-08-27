import { CreateResourceSchema, UpdateResourceSchema } from "../models/resource.model";

const validCategoryId = "550e8400-e29b-41d4-a716-446655440000";
const validTagId = "550e8400-e29b-41d4-a716-446655440001";

describe("CreateResourceSchema", () => {
  it("accepts valid input", () => {
    const result = CreateResourceSchema.safeParse({
      name: "My Resource",
      description: "A description",
      categoryId: validCategoryId,
      tagIds: [validTagId],
    });
    expect(result.success).toBe(true);
  });

  it("accepts input without optional fields", () => {
    const result = CreateResourceSchema.safeParse({
      name: "My Resource",
      categoryId: validCategoryId,
    });
    expect(result.success).toBe(true);
  });

  it("fails when name is missing", () => {
    const result = CreateResourceSchema.safeParse({
      categoryId: validCategoryId,
    });
    expect(result.success).toBe(false);
  });

  it("fails when categoryId is missing", () => {
    const result = CreateResourceSchema.safeParse({
      name: "My Resource",
    });
    expect(result.success).toBe(false);
  });

  it("fails when categoryId is not a valid UUID", () => {
    const result = CreateResourceSchema.safeParse({
      name: "My Resource",
      categoryId: "not-a-uuid",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const uuidError = result.error.issues.find((e) => e.path.includes("categoryId"));
      expect(uuidError).toBeDefined();
    }
  });

  it("fails when name exceeds 255 characters", () => {
    const result = CreateResourceSchema.safeParse({
      name: "a".repeat(256),
      categoryId: validCategoryId,
    });
    expect(result.success).toBe(false);
  });

  it("fails when tagIds contains an invalid UUID", () => {
    const result = CreateResourceSchema.safeParse({
      name: "My Resource",
      categoryId: validCategoryId,
      tagIds: ["not-a-uuid"],
    });
    expect(result.success).toBe(false);
  });
});

describe("UpdateResourceSchema", () => {
  it("allows an empty object (all fields optional)", () => {
    const result = UpdateResourceSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("accepts partial update with name only", () => {
    const result = UpdateResourceSchema.safeParse({ name: "Updated Name" });
    expect(result.success).toBe(true);
  });

  it("accepts partial update with categoryId", () => {
    const result = UpdateResourceSchema.safeParse({ categoryId: validCategoryId });
    expect(result.success).toBe(true);
  });

  it("fails when categoryId is provided but not a valid UUID", () => {
    const result = UpdateResourceSchema.safeParse({ categoryId: "bad-uuid" });
    expect(result.success).toBe(false);
  });

  it("accepts tagIds array of valid UUIDs", () => {
    const result = UpdateResourceSchema.safeParse({ tagIds: [validTagId] });
    expect(result.success).toBe(true);
  });
});
