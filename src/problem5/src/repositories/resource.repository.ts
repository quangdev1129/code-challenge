import prisma from "../config/database";
import { CreateResourceDto, UpdateResourceDto, ResourceFilter } from "../models/resource.model";

const includeRelations = {
  category: true,
  tags: true,
};

export const resourceRepository = {
  async create(data: CreateResourceDto & { tagIds?: string[] }) {
    const { tagIds, categoryId, ...rest } = data;
    return prisma.resource.create({
      data: {
        ...rest,
        category: { connect: { id: categoryId } },
        ...(tagIds && tagIds.length > 0
          ? { tags: { connect: tagIds.map((id) => ({ id })) } }
          : {}),
      },
      include: includeRelations,
    });
  },

  async findAll(filter?: ResourceFilter) {
    const page = filter?.page ?? 1;
    const limit = filter?.limit ?? 10;
    const where = {
      ...(filter?.name ? { name: { contains: filter.name } } : {}),
      ...(filter?.categoryId ? { categoryId: filter.categoryId } : {}),
    };

    const [data, total] = await Promise.all([
      prisma.resource.findMany({
        where,
        include: includeRelations,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.resource.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  },

  async findById(id: string) {
    return prisma.resource.findUnique({
      where: { id },
      include: includeRelations,
    });
  },

  async update(id: string, data: UpdateResourceDto & { tagIds?: string[] }) {
    const { tagIds, categoryId, ...rest } = data;
    return prisma.resource.update({
      where: { id },
      data: {
        ...rest,
        ...(categoryId !== undefined
          ? { category: { connect: { id: categoryId } } }
          : {}),
        ...(tagIds !== undefined
          ? { tags: { set: tagIds.map((tagId) => ({ id: tagId })) } }
          : {}),
      },
      include: includeRelations,
    });
  },

  async delete(id: string) {
    return prisma.resource.delete({ where: { id } });
  },
};
