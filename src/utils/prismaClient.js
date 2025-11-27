const { PrismaClient } = require("@prisma/client");

/**
 * Prisma Client Singleton
 * Ensures only one instance of PrismaClient exists throughout the application
 * Prevents connection pool exhaustion in development
 */

let prisma;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to preserve the client across hot reloads
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      log: ["query", "info", "warn", "error"],
    });
  }
  prisma = global.prisma;
}

/**
 * Graceful shutdown handler
 * Ensures Prisma disconnects cleanly when the application exits
 */
process.on("beforeExit", async () => {
  await prisma.$disconnect();
});

module.exports = prisma;
