import "dotenv/config";
import prisma from "./config/database";
import { createApp } from "./app";

const PORT = parseInt(process.env.PORT || "3000", 10);

async function main() {
  try {
    await prisma.$connect();
    console.log("Database connection established");

    const app = createApp();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/docs`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

main();
