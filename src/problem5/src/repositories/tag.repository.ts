import prisma from "../config/database";

const includeResourceCount = {
  _count: { select: { resources: true } },
};

export const tagRepository = {
  findAll() {
    return prisma.tag.findMany({
      include: includeResourceCount,
      orderBy: { createdAt: "desc" },
    });
  },

  findById(id: string) {
    return prisma.tag.findUnique({
      where: { id },
      include: includeResourceCount,
    });
  },
};
