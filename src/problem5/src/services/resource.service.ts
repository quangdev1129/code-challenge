import { resourceRepository } from "../repositories/resource.repository";
import { CreateResourceDto, UpdateResourceDto, ResourceFilter } from "../models/resource.model";
import { NotFoundError } from "../errors/AppError";

export const resourceService = {
  async create(data: CreateResourceDto) {
    return resourceRepository.create(data);
  },

  async findAll(filter?: ResourceFilter) {
    return resourceRepository.findAll(filter);
  },

  async findById(id: string) {
    const resource = await resourceRepository.findById(id);
    if (!resource) {
      throw new NotFoundError(`Resource with id '${id}' not found`);
    }
    return resource;
  },

  async update(id: string, data: UpdateResourceDto) {
    const existing = await resourceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Resource with id '${id}' not found`);
    }
    return resourceRepository.update(id, data);
  },

  async delete(id: string) {
    const existing = await resourceRepository.findById(id);
    if (!existing) {
      throw new NotFoundError(`Resource with id '${id}' not found`);
    }
    return resourceRepository.delete(id);
  },
};
