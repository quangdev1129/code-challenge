import { Request, Response, NextFunction } from "express";
import { resourceService } from "../services/resource.service";
import {
  CreateResourceSchema,
  UpdateResourceSchema,
  ResourceFilterSchema,
} from "../models/resource.model";

export const resourceController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = CreateResourceSchema.parse(req.body);
      const resource = await resourceService.create(data);
      res.status(201).json(resource);
    } catch (error) {
      next(error);
    }
  },

  async findAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filter = ResourceFilterSchema.parse(req.query);
      const result = await resourceService.findAll(filter);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const resource = await resourceService.findById(id);
      res.status(200).json(resource);
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = UpdateResourceSchema.parse(req.body);
      const resource = await resourceService.update(id, data);
      res.status(200).json(resource);
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await resourceService.delete(id);
      res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
