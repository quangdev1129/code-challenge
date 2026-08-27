import { tagRepository } from "../repositories/tag.repository";
import { NotFoundError } from "../errors/AppError";

export const tagService = {
  findAll() {
    return tagRepository.findAll();
  },

  async findById(id: string) {
    const tag = await tagRepository.findById(id);
    if (!tag) throw new NotFoundError(`Tag with id '${id}' not found`);
    return tag;
  },
};
