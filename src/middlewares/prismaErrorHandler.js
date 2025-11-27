/**
 * Middleware para manejar errores específicos de Prisma
 * Convierte códigos de error de Prisma en respuestas HTTP apropiadas
 */

const prismaErrorHandler = (err, req, res, next) => {
  // Si no es un error de Prisma, pasar al siguiente handler
  if (!err.code || !err.code.startsWith("P")) {
    return next(err);
  }

  console.error("Prisma Error:", err);

  // Errores comunes de Prisma
  switch (err.code) {
    case "P2002":
      // Violación de restricción única
      const target = err.meta?.target || ["campo"];
      return res.status(409).json({
        status: "fail",
        message: `El ${target[0]} ya existe en la base de datos`,
        error: "Conflict",
      });

    case "P2025":
      // Registro no encontrado
      return res.status(404).json({
        status: "fail",
        message: "El registro solicitado no fue encontrado",
        error: "Not Found",
      });

    case "P2003":
      // Violación de llave foránea
      return res.status(400).json({
        status: "fail",
        message: "Operación inválida: referencia a registro inexistente",
        error: "Foreign Key Constraint",
      });

    case "P2014":
      // Error de relación requerida
      return res.status(400).json({
        status: "fail",
        message: "La operación viola una relación requerida",
        error: "Relation Violation",
      });

    case "P2000":
      // Valor demasiado largo
      return res.status(400).json({
        status: "fail",
        message: "El valor proporcionado es demasiado largo para el campo",
        error: "Value Too Long",
      });

    case "P2001":
      // Registro no existe en where condition
      return res.status(404).json({
        status: "fail",
        message: "El registro no existe",
        error: "Not Found",
      });

    default:
      // Error genérico de Prisma
      return res.status(500).json({
        status: "error",
        message:
          process.env.NODE_ENV === "development"
            ? `Error de base de datos: ${err.message}`
            : "Error al procesar la solicitud",
        error: "Database Error",
        ...(process.env.NODE_ENV === "development" && { code: err.code }),
      });
  }
};

module.exports = prismaErrorHandler;
