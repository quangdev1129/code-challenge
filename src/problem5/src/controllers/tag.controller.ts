import { Request, Response, NextFunction } from "express";
import { tagService } from "../services/tag.service";

export const tagController = {
  async findAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tags = await tagService.findAll();
      res.status(200).json(tags);
    } catch (error) {
      next(error);
    }
  },

  async findById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tag = await tagService.findById(req.params.id);
      res.status(200).json(tag);
    } catch (error) {
      next(error);
    }
  },
};
