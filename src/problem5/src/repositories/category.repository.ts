import prisma from "../config/database";

const includeResourceCount = {
  _count: { select: { resources: true } },
};

export const categoryRepository = {
  findAll() {
    return prisma.category.findMany({
      include: includeResourceCount,
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
      include: includeResourceCount,
    });
  },

  delete(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};
