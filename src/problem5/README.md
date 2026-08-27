# Problem 5 — CRUD API (Express + TypeScript + Prisma + MySQL)

A RESTful CRUD API for managing **Resources**, built with Express.js, TypeScript, Prisma ORM, and MySQL. Demonstrates 1-n, n-1, and n-n database relationships across three entities.

---

## Tech Stack

| Layer        | Technology                        |
|--------------|-----------------------------------|
| Runtime      | Node.js 18+, TypeScript           |
| Framework    | Express.js                        |
| ORM          | Prisma 5                          |
| Database     | MySQL 8                           |
| Validation   | Zod                               |
| API Docs     | Swagger UI (`/docs`)              |
| Testing      | Jest + ts-jest                    |
| Container    | Docker + Docker Compose           |

---

## Project Structure

```
src/problem5/
├── src/
│   ├── __tests__/                  # Unit tests (excluded from production build)
│   │   ├── errorHandler.test.ts    # Middleware error handling tests
│   │   ├── resource.model.test.ts  # Zod schema validation tests
│   │   └── resource.service.test.ts # Service layer tests (repository mocked)
│   ├── config/
│   │   └── database.ts             # PrismaClient singleton
│   ├── docs/
│   │   └── swagger.ts              # OpenAPI 3.0 spec (served at /docs)
│   ├── errors/
│   │   └── AppError.ts             # Typed error hierarchy (AppError, NotFoundError, ValidationError)
│   ├── middleware/
│   │   └── errorHandler.ts         # Centralised error handling (Zod + AppError + unknown)
│   ├── models/
│   │   └── resource.model.ts       # Zod schemas for request validation (DTOs)
│   ├── repositories/
│   │   ├── resource.repository.ts  # Data access layer for Resource
│   │   ├── category.repository.ts  # Data access layer for Category (read-only)
│   │   └── tag.repository.ts       # Data access layer for Tag (read-only)
│   ├── services/
│   │   ├── resource.service.ts     # Business logic for Resource
│   │   ├── category.service.ts     # Business logic for Category (read-only)
│   │   └── tag.service.ts          # Business logic for Tag (read-only)
│   ├── controllers/
│   │   ├── resource.controller.ts  # HTTP layer for Resource
│   │   ├── category.controller.ts  # HTTP layer for Category (read-only)
│   │   └── tag.controller.ts       # HTTP layer for Tag (read-only)
│   ├── routes/
│   │   ├── resource.routes.ts      # Full CRUD routes for Resource
│   │   ├── category.routes.ts      # Read-only routes for Category
│   │   └── tag.routes.ts           # Read-only routes for Tag
│   ├── app.ts                      # Express app factory (middleware, routes, /docs, 404)
│   └── server.ts                   # Entry point — connect Prisma, start HTTP server
├── prisma/
│   └── schema.prisma               # Data models and relationships
├── Dockerfile                      # Multi-stage build: builder → production image
├── docker-compose.yml              # Orchestrates app + mysql:8
├── .env.example                    # Environment variable template
├── jest.config.js                  # Jest configuration (ts-jest)
├── tsconfig.json                   # Production TypeScript config (excludes __tests__)
├── tsconfig.test.json              # Test TypeScript config (adds jest types)
└── package.json
```

---

## Data Models & Relationships

```
Category ──< Resource >──< Tag
```

| Relationship | Description |
|---|---|
| **1-n** | One `Category` has many `Resource`s |
| **n-1** | Many `Resource`s belong to one `Category` |
| **n-n** | `Resource` and `Tag` share a many-to-many relation (implicit join table) |

### Prisma schema summary

```prisma
model Category {
  id        String     @id @default(uuid())
  name      String     @unique
  resources Resource[]
}

model Tag {
  id        String     @id @default(uuid())
  name      String     @unique
  resources Resource[]
}

model Resource {
  id          String   @id @default(uuid())
  name        String
  description String?
  categoryId  String
  category    Category @relation(...)   // n-1
  tags        Tag[]                     // n-n
}
```

> **Category** and **Tag** are read-only via the API. Use the seed script (see below) or Prisma Studio to populate them, then reference their IDs when creating Resources.

---

## Prerequisites

- Node.js 18+
- npm 9+
- Docker & Docker Compose (for containerised setup)

---

## Local Development (without Docker)

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your local MySQL connection string
```

### 3. Apply database migrations

```bash
npx prisma migrate dev --name init
```

### 4. Run in dev mode (hot-reload)

```bash
npm run dev
```

The server starts on `http://localhost:3000`.

---

## Docker Setup (recommended)

Builds the app and starts both MySQL and the API in containers.
Migrations are applied automatically on container startup via `prisma migrate deploy`.

```bash
docker compose up --build
```

| Service | URL |
|---------|-----|
| API     | http://localhost:3000 |
| MySQL   | localhost:3306 |
| Swagger | http://localhost:3000/docs |

To stop:

```bash
docker compose down
```

To stop and wipe all data:

```bash
docker compose down -v
```

---

## Build & Production

```bash
npm run build   # Compile TypeScript → dist/
npm start       # Run compiled output
```

---

## API Endpoints

Base URL: `http://localhost:3000`

### Health

| Method | Path      | Description               |
|--------|-----------|---------------------------|
| GET    | `/health` | Returns `{ status: "ok" }` |

### Resources — full CRUD

| Method | Path              | Description                            |
|--------|-------------------|----------------------------------------|
| POST   | `/resources`      | Create a resource                      |
| GET    | `/resources`      | List resources (supports filters)      |
| GET    | `/resources/:id`  | Get a resource by UUID                 |
| PUT    | `/resources/:id`  | Update a resource (partial)            |
| DELETE | `/resources/:id`  | Delete a resource                      |

### Categories — read-only

| Method | Path                | Description               |
|--------|---------------------|---------------------------|
| GET    | `/categories`       | List all categories       |
| GET    | `/categories/:id`   | Get a category by UUID    |

### Tags — read-only

| Method | Path          | Description          |
|--------|---------------|----------------------|
| GET    | `/tags`       | List all tags        |
| GET    | `/tags/:id`   | Get a tag by UUID    |

---

## Request & Response

### `POST /resources` — Create

**Body** (`Content-Type: application/json`):

```json
{
  "name": "My Resource",
  "description": "An optional description",
  "categoryId": "<category-uuid>",
  "tagIds": ["<tag-uuid-1>", "<tag-uuid-2>"]
}
```

| Field        | Type             | Required | Notes                          |
|--------------|------------------|----------|--------------------------------|
| `name`       | string (max 255) | Yes      |                                |
| `description`| string           | No       |                                |
| `categoryId` | UUID string      | Yes      | Must reference an existing category |
| `tagIds`     | UUID[]           | No       | Associates tags (n-n)          |

**Response** `201`:

```json
{
  "id": "uuid",
  "name": "My Resource",
  "description": "An optional description",
  "categoryId": "uuid",
  "category": { "id": "uuid", "name": "Tools" },
  "tags": [{ "id": "uuid", "name": "featured" }],
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### `GET /resources` — List with filters and pagination

| Query param  | Type    | Default | Description                          |
|--------------|---------|---------|--------------------------------------|
| `name`       | string  | —       | Partial match on resource name       |
| `categoryId` | UUID    | —       | Filter by exact category             |
| `page`       | integer | `1`     | Page number (min 1)                  |
| `limit`      | integer | `10`    | Items per page (min 1, max 100)      |

```bash
GET /resources?name=widget&categoryId=<uuid>&page=1&limit=10
```

**Response** `200`:

```json
{
  "data": [ ... ],
  "meta": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  }
}
```

### `PUT /resources/:id` — Update (partial)

All fields are optional. Only provided fields are updated.

```json
{
  "description": "Updated description",
  "tagIds": ["<tag-uuid>"]
}
```

### `DELETE /resources/:id` — Delete

Permanently removes a resource by UUID.

**URL parameter:** `id` — UUID of the resource to delete.

**Response** `200`:

```json
{
  "message": "Resource deleted successfully"
}
```

**Response** `404` (resource not found):

```json
{
  "status": "error",
  "message": "Resource with id '<id>' not found"
}
```

---

## Example `curl` Commands

### Health check

```bash
curl http://localhost:3000/health
```

```json
{
    "status": "ok"
}
```

---

### List categories

```bash
curl http://localhost:3000/categories
```

```json
[
    {
        "id": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
        "name": "Tools",
        "createdAt": "2026-04-06T07:12:44.869Z",
        "updatedAt": "2026-04-06T07:12:44.869Z",
        "_count": {
            "resources": 2
        }
    },
    {
        "id": "abf67a54-4ceb-43ed-97c9-0085f76f7ea1",
        "name": "Development",
        "createdAt": "2026-04-06T07:12:44.869Z",
        "updatedAt": "2026-04-06T07:12:44.869Z",
        "_count": {
            "resources": 1
        }
    },
    {
        "id": "b44cfaac-f08e-497a-b3ee-568f1a1363c3",
        "name": "Design",
        "createdAt": "2026-04-06T07:12:44.869Z",
        "updatedAt": "2026-04-06T07:12:44.869Z",
        "_count": {
            "resources": 2
        }
    }
]
```

---

### Get a category by ID

```bash
curl http://localhost:3000/categories/9ebdc145-6145-4cfa-ae30-3711f950fb22
```

```json
{
    "id": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
    "name": "Tools",
    "createdAt": "2026-04-06T07:12:44.869Z",
    "updatedAt": "2026-04-06T07:12:44.869Z",
    "_count": {
        "resources": 2
    }
}
```

---

### List tags

```bash
curl http://localhost:3000/tags
```

```json
[
    {
        "id": "751cf114-34f7-4c04-861f-0baa42f631e5",
        "name": "new",
        "createdAt": "2026-04-06T07:12:44.881Z",
        "_count": {
            "resources": 2
        }
    },
    {
        "id": "8be88f5c-74a5-437e-8ec0-469c82686232",
        "name": "open-source",
        "createdAt": "2026-04-06T07:12:44.881Z",
        "_count": {
            "resources": 3
        }
    },
    {
        "id": "9be6d436-d112-4456-8ab3-541efc357aa6",
        "name": "popular",
        "createdAt": "2026-04-06T07:12:44.881Z",
        "_count": {
            "resources": 2
        }
    },
    {
        "id": "eb5540cb-ff52-4df6-a8b2-e14f5b62964c",
        "name": "featured",
        "createdAt": "2026-04-06T07:12:44.881Z",
        "_count": {
            "resources": 3
        }
    }
]
```

---

### Get a tag by ID

```bash
curl http://localhost:3000/tags/eb5540cb-ff52-4df6-a8b2-e14f5b62964c
```

```json
{
    "id": "eb5540cb-ff52-4df6-a8b2-e14f5b62964c",
    "name": "featured",
    "createdAt": "2026-04-06T07:12:44.881Z",
    "_count": {
        "resources": 3
    }
}
```

---

### Create a resource

```bash
curl -X POST http://localhost:3000/resources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Widget",
    "description": "A useful widget",
    "categoryId": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
    "tagIds": ["eb5540cb-ff52-4df6-a8b2-e14f5b62964c"]
  }'
```

```json
{
    "id": "ebdc8a22-ab41-47e3-a10f-4d5f7b61c093",
    "name": "Widget",
    "description": "A useful widget",
    "categoryId": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
    "createdAt": "2026-04-06T07:13:15.535Z",
    "updatedAt": "2026-04-06T07:13:15.535Z",
    "category": {
        "id": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
        "name": "Tools",
        "createdAt": "2026-04-06T07:12:44.869Z",
        "updatedAt": "2026-04-06T07:12:44.869Z"
    },
    "tags": [
        {
            "id": "eb5540cb-ff52-4df6-a8b2-e14f5b62964c",
            "name": "featured",
            "createdAt": "2026-04-06T07:12:44.881Z"
        }
    ]
}
```

---

### List all resources (default pagination)

```bash
curl http://localhost:3000/resources
```

```json
{
    "data": [
        {
            "id": "00000000-0000-0000-0000-000000000005",
            "name": "Docker Dev Toolkit",
            "description": "Docker Compose templates for common development stacks.",
            "categoryId": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
            "createdAt": "2026-04-06T07:12:44.890Z",
            "updatedAt": "2026-04-06T07:12:44.890Z",
            "category": {
                "id": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
                "name": "Tools",
                "createdAt": "2026-04-06T07:12:44.869Z",
                "updatedAt": "2026-04-06T07:12:44.869Z"
            },
            "tags": [
                {
                    "id": "8be88f5c-74a5-437e-8ec0-469c82686232",
                    "name": "open-source",
                    "createdAt": "2026-04-06T07:12:44.881Z"
                },
                {
                    "id": "eb5540cb-ff52-4df6-a8b2-e14f5b62964c",
                    "name": "featured",
                    "createdAt": "2026-04-06T07:12:44.881Z"
                }
            ]
        },
        { "...": "3 more items" }
    ],
    "meta": {
        "total": 5,
        "page": 1,
        "limit": 10,
        "totalPages": 1
    }
}
```

---

### List resources with pagination

```bash
curl "http://localhost:3000/resources?page=1&limit=2"
```

```json
{
    "data": [
        {
            "id": "00000000-0000-0000-0000-000000000005",
            "name": "Docker Dev Toolkit",
            "description": "Docker Compose templates for common development stacks.",
            "categoryId": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
            "createdAt": "2026-04-06T07:12:44.890Z",
            "updatedAt": "2026-04-06T07:12:44.890Z",
            "category": {
                "id": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
                "name": "Tools",
                "createdAt": "2026-04-06T07:12:44.869Z",
                "updatedAt": "2026-04-06T07:12:44.869Z"
            },
            "tags": [
                {
                    "id": "8be88f5c-74a5-437e-8ec0-469c82686232",
                    "name": "open-source",
                    "createdAt": "2026-04-06T07:12:44.881Z"
                },
                {
                    "id": "eb5540cb-ff52-4df6-a8b2-e14f5b62964c",
                    "name": "featured",
                    "createdAt": "2026-04-06T07:12:44.881Z"
                }
            ]
        },
        {
            "id": "00000000-0000-0000-0000-000000000001",
            "name": "Figma Design System",
            "description": "A comprehensive design system built in Figma for rapid prototyping.",
            "categoryId": "b44cfaac-f08e-497a-b3ee-568f1a1363c3",
            "createdAt": "2026-04-06T07:12:44.889Z",
            "updatedAt": "2026-04-06T07:12:44.889Z",
            "category": {
                "id": "b44cfaac-f08e-497a-b3ee-568f1a1363c3",
                "name": "Design",
                "createdAt": "2026-04-06T07:12:44.869Z",
                "updatedAt": "2026-04-06T07:12:44.869Z"
            },
            "tags": [
                {
                    "id": "9be6d436-d112-4456-8ab3-541efc357aa6",
                    "name": "popular",
                    "createdAt": "2026-04-06T07:12:44.881Z"
                },
                {
                    "id": "eb5540cb-ff52-4df6-a8b2-e14f5b62964c",
                    "name": "featured",
                    "createdAt": "2026-04-06T07:12:44.881Z"
                }
            ]
        }
    ],
    "meta": {
        "total": 5,
        "page": 1,
        "limit": 2,
        "totalPages": 3
    }
}
```

---

### Filter resources by name

```bash
curl "http://localhost:3000/resources?name=figma"
```

```json
[
    {
        "id": "00000000-0000-0000-0000-000000000001",
        "name": "Figma Design System",
        "description": "A comprehensive design system built in Figma for rapid prototyping.",
        "categoryId": "b44cfaac-f08e-497a-b3ee-568f1a1363c3",
        "createdAt": "2026-04-06T07:12:44.889Z",
        "updatedAt": "2026-04-06T07:12:44.889Z",
        "category": {
            "id": "b44cfaac-f08e-497a-b3ee-568f1a1363c3",
            "name": "Design",
            "createdAt": "2026-04-06T07:12:44.869Z",
            "updatedAt": "2026-04-06T07:12:44.869Z"
        },
        "tags": [
            {
                "id": "9be6d436-d112-4456-8ab3-541efc357aa6",
                "name": "popular",
                "createdAt": "2026-04-06T07:12:44.881Z"
            },
            {
                "id": "eb5540cb-ff52-4df6-a8b2-e14f5b62964c",
                "name": "featured",
                "createdAt": "2026-04-06T07:12:44.881Z"
            }
        ]
    }
]
```

---

### Filter resources by category

```bash
curl "http://localhost:3000/resources?categoryId=9ebdc145-6145-4cfa-ae30-3711f950fb22"
```

```json
[
    {
        "id": "00000000-0000-0000-0000-000000000005",
        "name": "Docker Dev Toolkit",
        "description": "Docker Compose templates for common development stacks.",
        "categoryId": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
        "createdAt": "2026-04-06T07:12:44.890Z",
        "updatedAt": "2026-04-06T07:12:44.890Z",
        "category": {
            "id": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
            "name": "Tools",
            "createdAt": "2026-04-06T07:12:44.869Z",
            "updatedAt": "2026-04-06T07:12:44.869Z"
        },
        "tags": [
            {
                "id": "8be88f5c-74a5-437e-8ec0-469c82686232",
                "name": "open-source",
                "createdAt": "2026-04-06T07:12:44.881Z"
            },
            {
                "id": "eb5540cb-ff52-4df6-a8b2-e14f5b62964c",
                "name": "featured",
                "createdAt": "2026-04-06T07:12:44.881Z"
            }
        ]
    },
    {
        "id": "00000000-0000-0000-0000-000000000002",
        "name": "VS Code Extension Pack",
        "description": "A curated set of VS Code extensions for TypeScript development.",
        "categoryId": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
        "createdAt": "2026-04-06T07:12:44.889Z",
        "updatedAt": "2026-04-06T07:12:44.889Z",
        "category": {
            "id": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
            "name": "Tools",
            "createdAt": "2026-04-06T07:12:44.869Z",
            "updatedAt": "2026-04-06T07:12:44.869Z"
        },
        "tags": [
            {
                "id": "8be88f5c-74a5-437e-8ec0-469c82686232",
                "name": "open-source",
                "createdAt": "2026-04-06T07:12:44.881Z"
            },
            {
                "id": "9be6d436-d112-4456-8ab3-541efc357aa6",
                "name": "popular",
                "createdAt": "2026-04-06T07:12:44.881Z"
            }
        ]
    }
]
```

---

### Get a resource by ID

```bash
curl http://localhost:3000/resources/00000000-0000-0000-0000-000000000001
```

```json
{
    "id": "00000000-0000-0000-0000-000000000001",
    "name": "Figma Design System",
    "description": "A comprehensive design system built in Figma for rapid prototyping.",
    "categoryId": "b44cfaac-f08e-497a-b3ee-568f1a1363c3",
    "createdAt": "2026-04-06T07:12:44.889Z",
    "updatedAt": "2026-04-06T07:12:44.889Z",
    "category": {
        "id": "b44cfaac-f08e-497a-b3ee-568f1a1363c3",
        "name": "Design",
        "createdAt": "2026-04-06T07:12:44.869Z",
        "updatedAt": "2026-04-06T07:12:44.869Z"
    },
    "tags": [
        {
            "id": "9be6d436-d112-4456-8ab3-541efc357aa6",
            "name": "popular",
            "createdAt": "2026-04-06T07:12:44.881Z"
        },
        {
            "id": "eb5540cb-ff52-4df6-a8b2-e14f5b62964c",
            "name": "featured",
            "createdAt": "2026-04-06T07:12:44.881Z"
        }
    ]
}
```

---

### Update a resource

```bash
curl -X PUT http://localhost:3000/resources/ebdc8a22-ab41-47e3-a10f-4d5f7b61c093 \
  -H "Content-Type: application/json" \
  -d '{"description": "Updated description"}'
```

```json
{
    "id": "ebdc8a22-ab41-47e3-a10f-4d5f7b61c093",
    "name": "Widget",
    "description": "Updated description",
    "categoryId": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
    "createdAt": "2026-04-06T07:13:15.535Z",
    "updatedAt": "2026-04-06T07:13:19.830Z",
    "category": {
        "id": "9ebdc145-6145-4cfa-ae30-3711f950fb22",
        "name": "Tools",
        "createdAt": "2026-04-06T07:12:44.869Z",
        "updatedAt": "2026-04-06T07:12:44.869Z"
    },
    "tags": [
        {
            "id": "eb5540cb-ff52-4df6-a8b2-e14f5b62964c",
            "name": "featured",
            "createdAt": "2026-04-06T07:12:44.881Z"
        }
    ]
}
```

---

### Delete a resource

```bash
curl -X DELETE http://localhost:3000/resources/ebdc8a22-ab41-47e3-a10f-4d5f7b61c093
```

```json
{
    "message": "Resource deleted successfully"
}
```

**404 response when ID does not exist:**

```bash
curl -X DELETE http://localhost:3000/resources/00000000-0000-0000-0000-000000000000
```

```json
{
    "status": "error",
    "message": "Resource with id '00000000-0000-0000-0000-000000000000' not found"
}
```

---

## Swagger UI

Interactive API documentation is available at:

```
http://localhost:3000/docs
```

---

## Testing

```bash
npm test              # Run all tests once
npm run test:watch    # Watch mode
```

Tests are located in `src/__tests__/` and cover:

| File | What is tested |
|------|----------------|
| `errorHandler.test.ts` | Zod errors → 400, `NotFoundError` → 404, `AppError` → custom status, unknown → 500 |
| `resource.model.test.ts` | Zod schema: required fields, UUID validation, partial updates |
| `resource.service.test.ts` | Service logic with mocked repository: found/not-found cases |

### Test results

```
PASS src/__tests__/resource.service.test.ts
  resourceService
    findById
      ✓ returns resource when found (1 ms)
      ✓ throws NotFoundError when resource does not exist (2 ms)
    delete
      ✓ calls repository delete when resource exists
      ✓ throws NotFoundError when resource does not exist

PASS src/__tests__/resource.model.test.ts
  CreateResourceSchema
    ✓ accepts valid input (1 ms)
    ✓ accepts input without optional fields
    ✓ fails when name is missing (1 ms)
    ✓ fails when categoryId is missing
    ✓ fails when categoryId is not a valid UUID
    ✓ fails when name exceeds 255 characters (1 ms)
    ✓ fails when tagIds contains an invalid UUID
  UpdateResourceSchema
    ✓ allows an empty object (all fields optional)
    ✓ accepts partial update with name only
    ✓ accepts partial update with categoryId
    ✓ fails when categoryId is provided but not a valid UUID
    ✓ accepts tagIds array of valid UUIDs

PASS src/__tests__/errorHandler.test.ts
  errorHandler middleware
    ✓ handles ZodError with 400 and error details (1 ms)
    ✓ handles NotFoundError with 404
    ✓ handles AppError(409) with 409
    ✓ handles unknown Error with 500

Test Suites: 3 passed, 3 total
Tests:       20 passed, 20 total
Snapshots:   0 total
Time:        0.884 s
```

---

## Seed Script

Populate the database with sample Categories, Tags, and Resources that demonstrate all three relationship types.

```bash
npx prisma db seed
```

This creates:

| Entity | Seeded records |
|--------|---------------|
| Categories | Tools, Design, Development |
| Tags | featured, popular, new, open-source |
| Resources | 5 resources, each linked to a category and one or more tags |

The seed uses `upsert` so it is safe to run multiple times — it will not create duplicates.

To reset the database and re-seed from scratch:

```bash
npx prisma migrate reset   # drops all data, re-applies migrations, then auto-runs seed
```

---

## Prisma Commands

```bash
# Create and apply a new migration (development)
npx prisma migrate dev --name <migration-name>

# Apply pending migrations (production / CI)
npx prisma migrate deploy

# Push schema changes without a migration file (prototyping)
npx prisma db push

# Regenerate the Prisma client after schema changes
npx prisma generate

# Open Prisma Studio (browser GUI for browsing and editing data)
npm run prisma:studio
```

---

## Environment Variables

| Variable       | Default                                        | Description                         |
|----------------|------------------------------------------------|-------------------------------------|
| `PORT`         | `3000`                                         | HTTP port the server listens on     |
| `DATABASE_URL` | `mysql://user:password@localhost:3306/crud_db` | Prisma MySQL connection URL         |
| `NODE_ENV`     | `development`                                  | Node environment (`development` / `production`) |
