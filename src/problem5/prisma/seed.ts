import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // ── Categories (1-n with Resource) ───────────────────────────────────────
  const [toolsCategory, designCategory, devCategory] = await Promise.all([
    prisma.category.upsert({
      where: { name: "Tools" },
      update: {},
      create: { name: "Tools" },
    }),
    prisma.category.upsert({
      where: { name: "Design" },
      update: {},
      create: { name: "Design" },
    }),
    prisma.category.upsert({
      where: { name: "Development" },
      update: {},
      create: { name: "Development" },
    }),
  ]);
  console.log(`  ✓ Categories: ${toolsCategory.name}, ${designCategory.name}, ${devCategory.name}`);

  // ── Tags (n-n with Resource) ──────────────────────────────────────────────
  const [featuredTag, popularTag, newTag, openSourceTag] = await Promise.all([
    prisma.tag.upsert({
      where: { name: "featured" },
      update: {},
      create: { name: "featured" },
    }),
    prisma.tag.upsert({
      where: { name: "popular" },
      update: {},
      create: { name: "popular" },
    }),
    prisma.tag.upsert({
      where: { name: "new" },
      update: {},
      create: { name: "new" },
    }),
    prisma.tag.upsert({
      where: { name: "open-source" },
      update: {},
      create: { name: "open-source" },
    }),
  ]);
  console.log(
    `  ✓ Tags: ${featuredTag.name}, ${popularTag.name}, ${newTag.name}, ${openSourceTag.name}`
  );

  // ── Resources (n-1 Category, n-n Tags) ───────────────────────────────────
  const resources = await Promise.all([
    prisma.resource.upsert({
      where: { id: "00000000-0000-0000-0000-000000000001" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000001",
        name: "Figma Design System",
        description: "A comprehensive design system built in Figma for rapid prototyping.",
        category: { connect: { id: designCategory.id } },
        tags: { connect: [{ id: featuredTag.id }, { id: popularTag.id }] },
      },
    }),
    prisma.resource.upsert({
      where: { id: "00000000-0000-0000-0000-000000000002" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000002",
        name: "VS Code Extension Pack",
        description: "A curated set of VS Code extensions for TypeScript development.",
        category: { connect: { id: toolsCategory.id } },
        tags: { connect: [{ id: popularTag.id }, { id: openSourceTag.id }] },
      },
    }),
    prisma.resource.upsert({
      where: { id: "00000000-0000-0000-0000-000000000003" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000003",
        name: "Express Boilerplate",
        description: "A production-ready Express + TypeScript starter with Prisma and Zod.",
        category: { connect: { id: devCategory.id } },
        tags: {
          connect: [
            { id: featuredTag.id },
            { id: newTag.id },
            { id: openSourceTag.id },
          ],
        },
      },
    }),
    prisma.resource.upsert({
      where: { id: "00000000-0000-0000-0000-000000000004" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000004",
        name: "Tailwind UI Kit",
        description: "Pre-built Tailwind CSS components ready for production use.",
        category: { connect: { id: designCategory.id } },
        tags: { connect: [{ id: newTag.id }] },
      },
    }),
    prisma.resource.upsert({
      where: { id: "00000000-0000-0000-0000-000000000005" },
      update: {},
      create: {
        id: "00000000-0000-0000-0000-000000000005",
        name: "Docker Dev Toolkit",
        description: "Docker Compose templates for common development stacks.",
        category: { connect: { id: toolsCategory.id } },
        tags: { connect: [{ id: featuredTag.id }, { id: openSourceTag.id }] },
      },
    }),
  ]);

  console.log(`  ✓ Resources: ${resources.map((r) => r.name).join(", ")}`);
  console.log("\nSeed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
