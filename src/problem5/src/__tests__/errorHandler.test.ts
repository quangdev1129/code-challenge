import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { errorHandler } from "../middleware/errorHandler";
import { AppError, NotFoundError } from "../errors/AppError";

function makeRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

const req = {} as Request;
const next = jest.fn() as NextFunction;

describe("errorHandler middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("handles ZodError with 400 and error details", () => {
    // Build a real ZodError via a parse failure so it matches Zod v4's issue shape
    const zodError = new ZodError([
      {
        code: "invalid_type",
        expected: "string",
        path: ["categoryId"],
        message: "Required",
      } as never,
    ]);
    const res = makeRes();

    errorHandler(zodError, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        message: "Validation failed",
        errors: expect.arrayContaining([
          expect.objectContaining({ path: "categoryId", message: "Required" }),
        ]),
      })
    );
  });

  it("handles NotFoundError with 404", () => {
    const error = new NotFoundError("Resource not found");
    const res = makeRes();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: "error", message: "Resource not found" })
    );
  });

  it("handles AppError(409) with 409", () => {
    const error = new AppError(409, "Cannot delete category with existing resources");
    const res = makeRes();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: "error",
        message: "Cannot delete category with existing resources",
      })
    );
  });

  it("handles unknown Error with 500", () => {
    const error = new Error("Something went wrong");
    const res = makeRes();

    errorHandler(error, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: "error", message: "Internal server error" })
    );
  });
});
