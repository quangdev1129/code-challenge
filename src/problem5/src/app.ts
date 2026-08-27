import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";
import resourceRoutes from "./routes/resource.routes";
import categoryRoutes from "./routes/category.routes";
import tagRoutes from "./routes/tag.routes";
import { errorHandler } from "./middleware/errorHandler";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({ status: "ok" });
  });

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use("/resources", resourceRoutes);
  app.use("/categories", categoryRoutes);
  app.use("/tags", tagRoutes);

  app.use((_req: Request, res: Response) => {
    res.status(404).json({ status: "error", message: "Route not found" });
  });

  app.use(errorHandler as (error: unknown, req: Request, res: Response, next: NextFunction) => void);

  return app;
}
