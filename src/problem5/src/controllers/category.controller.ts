import { Request, Response, NextFunction } from "express";
import { categoryService } from "../services/category.service";

export const categoryController = {
  async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const categories = await categoryService.findAll();
      res.status(200).json(categories);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const category = await categoryService.findById(req.params.id);
      res.status(200).json(category);
    } catch (error) {
      next(error);
    }
  },
};
