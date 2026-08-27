export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Resource Management API",
    version: "1.0.0",
    description:
      "A RESTful API demonstrating 1-n, n-1, and n-n Prisma relationships with Express + TypeScript + MySQL",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  tags: [
    { name: "Health", description: "Health check" },
    { name: "Resources", description: "Resource management" },
    { name: "Categories", description: "Category management (1-n with Resources)" },
    { name: "Tags", description: "Tag management (n-n with Resources)" },
  ],
  paths: {
    "/health": {
      get: {
        tags: ["Health"],
        summary: "Health check",
        responses: {
          "200": {
            description: "Service is healthy",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string", example: "ok" },
                  },
                },
              },
            },
          },
        },
      },
    },
    "/resources": {
      get: {
        tags: ["Resources"],
        summary: "List all resources",
        parameters: [
          {
            name: "name",
            in: "query",
            schema: { type: "string" },
            description: "Filter by name (partial match)",
          },
          {
            name: "categoryId",
            in: "query",
            schema: { type: "string", format: "uuid" },
            description: "Filter by category ID",
          },
        ],
        responses: {
          "200": {
            description: "List of resources",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Resource" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Resources"],
        summary: "Create a resource",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateResourceDto" },
            },
          },
        },
        responses: {
          "201": {
            description: "Resource created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Resource" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
    "/resources/{id}": {
      get: {
        tags: ["Resources"],
        summary: "Get a resource by ID",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": {
            description: "Resource found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Resource" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Resources"],
        summary: "Update a resource",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/UpdateResourceDto" },
            },
          },
        },
        responses: {
          "200": {
            description: "Resource updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Resource" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Resources"],
        summary: "Delete a resource",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": {
            description: "Resource deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Resource deleted successfully" },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
    "/categories": {
      get: {
        tags: ["Categories"],
        summary: "List all categories",
        responses: {
          "200": {
            description: "List of categories",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Category" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Categories"],
        summary: "Create a category",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCategoryDto" },
            },
          },
        },
        responses: {
          "201": {
            description: "Category created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Category" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
    "/categories/{id}": {
      get: {
        tags: ["Categories"],
        summary: "Get a category by ID",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": {
            description: "Category found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Category" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      put: {
        tags: ["Categories"],
        summary: "Update a category",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateCategoryDto" },
            },
          },
        },
        responses: {
          "200": {
            description: "Category updated",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Category" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Categories"],
        summary: "Delete a category",
        description: "Fails with 409 if the category has associated resources",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": {
            description: "Category deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Category deleted successfully" },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
          "409": {
            description: "Conflict – category has existing resources",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ErrorResponse" },
              },
            },
          },
        },
      },
    },
    "/tags": {
      get: {
        tags: ["Tags"],
        summary: "List all tags",
        responses: {
          "200": {
            description: "List of tags",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Tag" },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Tags"],
        summary: "Create a tag",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CreateTagDto" },
            },
          },
        },
        responses: {
          "201": {
            description: "Tag created",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Tag" },
              },
            },
          },
          "400": { $ref: "#/components/responses/ValidationError" },
        },
      },
    },
    "/tags/{id}": {
      get: {
        tags: ["Tags"],
        summary: "Get a tag by ID",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": {
            description: "Tag found",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Tag" },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
      delete: {
        tags: ["Tags"],
        summary: "Delete a tag",
        parameters: [{ $ref: "#/components/parameters/IdParam" }],
        responses: {
          "200": {
            description: "Tag deleted",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Tag deleted successfully" },
                  },
                },
              },
            },
          },
          "404": { $ref: "#/components/responses/NotFound" },
        },
      },
    },
  },
  components: {
    parameters: {
      IdParam: {
        name: "id",
        in: "path",
        required: true,
        schema: { type: "string", format: "uuid" },
        description: "Resource UUID",
      },
    },
    schemas: {
      Category: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Technology" },
          resourceCount: { type: "integer", example: 5 },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
          _count: {
            type: "object",
            properties: {
              resources: { type: "integer", example: 5 },
            },
          },
        },
      },
      Tag: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "typescript" },
          createdAt: { type: "string", format: "date-time" },
          _count: {
            type: "object",
            properties: {
              resources: { type: "integer", example: 3 },
            },
          },
        },
      },
      Resource: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "TypeScript Guide" },
          description: { type: "string", nullable: true, example: "A comprehensive guide" },
          categoryId: { type: "string", format: "uuid" },
          category: { $ref: "#/components/schemas/Category" },
          tags: {
            type: "array",
            items: { $ref: "#/components/schemas/Tag" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
      CreateResourceDto: {
        type: "object",
        required: ["name", "categoryId"],
        properties: {
          name: { type: "string", maxLength: 255, example: "TypeScript Guide" },
          description: { type: "string", nullable: true, example: "A comprehensive guide" },
          categoryId: { type: "string", format: "uuid" },
          tagIds: {
            type: "array",
            items: { type: "string", format: "uuid" },
            description: "Optional list of tag UUIDs to associate",
          },
        },
      },
      UpdateResourceDto: {
        type: "object",
        properties: {
          name: { type: "string", maxLength: 255 },
          description: { type: "string", nullable: true },
          categoryId: { type: "string", format: "uuid" },
          tagIds: {
            type: "array",
            items: { type: "string", format: "uuid" },
            description: "Replaces the full set of associated tags",
          },
        },
      },
      CreateCategoryDto: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", maxLength: 100, example: "Technology" },
        },
      },
      CreateTagDto: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", maxLength: 100, example: "typescript" },
        },
      },
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string", example: "Resource not found" },
        },
      },
      ValidationErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string", example: "Validation failed" },
          errors: {
            type: "array",
            items: {
              type: "object",
              properties: {
                path: { type: "string", example: "categoryId" },
                message: { type: "string", example: "categoryId must be a valid UUID" },
              },
            },
          },
        },
      },
    },
    responses: {
      NotFound: {
        description: "Not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      ValidationError: {
        description: "Validation error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ValidationErrorResponse" },
          },
        },
      },
    },
  },
};
