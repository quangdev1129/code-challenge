import { categoryRepository } from "../repositories/category.repository";
import { NotFoundError } from "../errors/AppError";

export const categoryService = {
  findAll() {
    return categoryRepository.findAll();
  },

  async findById(id: string) {
    const category = await categoryRepository.findById(id);
    if (!category) throw new NotFoundError(`Category with id '${id}' not found`);
    return category;
  },
};
