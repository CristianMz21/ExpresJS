require('dotenv').config();
/**
 * Script de prueba de conexión a PostgreSQL usando Prisma
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function testConnection() {
  console.log("🔍 Probando conexión a la base de datos...\n");

  try {
    // Intentar conectar a la base de datos
    await prisma.$connect();
    console.log("✅ Conexión exitosa a PostgreSQL!\n");

    // Obtener información de la base de datos
    const result =
      await prisma.$queryRaw`SELECT version(), current_database(), current_user`;
    console.log("📊 Información de la base de datos:");
    console.log(result);
    console.log("");

    // Verificar si hay tablas
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `;

    console.log("📋 Tablas en la base de datos:");
    if (tables.length === 0) {
      console.log("  ⚠️  No hay tablas creadas aún.");
      console.log("  💡 Ejecuta: npx prisma db push");
    } else {
      tables.forEach((table, index) => {
        console.log(`  ${index + 1}. ${table.table_name}`);
      });
    }
    console.log("");

    console.log("✨ Prueba de conexión completada exitosamente!");
  } catch (error) {
    console.error("❌ Error al conectar a la base de datos:\n");
    console.error("Mensaje:", error.message);
    console.error("");

    if (error.message.includes("ECONNREFUSED")) {
      console.log("💡 Solución: Asegúrate de que Docker esté corriendo:");
      console.log("   docker-compose up -d");
    } else if (error.message.includes("password authentication failed")) {
      console.log("💡 Solución: Verifica las credenciales en tu archivo .env");
    } else if (
      error.message.includes("database") &&
      error.message.includes("does not exist")
    ) {
      console.log(
        "💡 Solución: La base de datos no existe. Verifica el nombre en .env"
      );
    }

    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la prueba
testConnection();
