import "dotenv/config";
import app from "./app.js";
import { prisma } from "./lib/prisma.js";
import config from "./config/index.js";

const PORT = config.port || 5000;

async function main() {
  try {
    await prisma.$connect();

    console.log("✅ Database connected");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on ${PORT}`);
    });

  } catch (error) {
    console.error(error);

    await prisma.$disconnect();

    process.exit(1);
  }
}

main();