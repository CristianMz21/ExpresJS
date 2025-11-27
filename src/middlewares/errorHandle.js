// Códigos ANSI para colores
const colors = {
  reset: "\x1b[0m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  redBold: "\x1b[1m\x1b[31m",
  yellowBold: "\x1b[1m\x1b[33m",
};

const colorize = (text, color) => `${color}${text}${colors.reset}`;

/**
 * Clase base para errores personalizados de la aplicación
 */
class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error de validación (400)
 */
class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400);
    this.errors = errors;
    this.name = "ValidationError";
  }
}

/**
 * Error de no autorizado (401)
 */
class UnauthorizedError extends AppError {
  constructor(message = "No autorizado") {
    super(message, 401);
    this.name = "UnauthorizedError";
  }
}

/**
 * Error de prohibido (403)
 */
class ForbiddenError extends AppError {
  constructor(message = "Acceso prohibido") {
    super(message, 403);
    this.name = "ForbiddenError";
  }
}

/**
 * Error de no encontrado (404)
 */
class NotFoundError extends AppError {
  constructor(message = "Recurso no encontrado") {
    super(message, 404);
    this.name = "NotFoundError";
  }
}

/**
 * Error de conflicto (409)
 */
class ConflictError extends AppError {
  constructor(message = "Conflicto con el estado actual del recurso") {
    super(message, 409);
    this.name = "ConflictError";
  }
}

/**
 * Obtiene el color según el código de estado
 */
const getErrorColor = (statusCode) => {
  if (statusCode >= 500) return colors.redBold;
  if (statusCode >= 400) return colors.yellowBold;
  return colors.cyan;
};

/**
 * Formatea el error para logging con colores
 */
const formatErrorLog = (error, req, statusCode) => {
  const timestamp = new Date().toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const errorColor = getErrorColor(statusCode);
  const method = req.method;
  const url = req.url;
  const ip = req.ip || req.connection.remoteAddress || "unknown";

  console.error(
    colorize(`[${timestamp}]`, colors.gray),
    colorize(`ERROR ${statusCode}`, errorColor),
    colorize(`${method} ${url}`, colors.red),
    colorize(`| IP: ${ip}`, colors.gray)
  );

  console.error(
    colorize("  ├─ Mensaje:", colors.gray),
    colorize(error.message, colors.red)
  );

  if (error.name) {
    console.error(
      colorize("  ├─ Tipo:", colors.gray),
      colorize(error.name, colors.yellow)
    );
  }

  // Mostrar errores de validación si existen
  if (error.errors && Array.isArray(error.errors) && error.errors.length > 0) {
    console.error(colorize("  ├─ Errores de validación:", colors.gray));
    error.errors.forEach((err, index) => {
      const prefix = index === error.errors.length - 1 ? "  └─" : "  ├─";
      console.error(colorize(`${prefix}   • ${err}`, colors.yellow));
    });
  }
};

/**
 * Middleware de manejo de errores 404 (Not Found)
 */
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(
    `Ruta no encontrada: ${req.method} ${req.originalUrl}`
  );
  next(error);
};

/**
 * Middleware principal de manejo de errores
 */
const errorHandler = (error, req, res, next) => {
  // Si los headers ya fueron enviados, delegar al manejador por defecto
  if (res.headersSent) {
    return next(error);
  }

  // Determinar el código de estado
  let statusCode = error.statusCode || 500;
  let message = error.message || "Ocurrió un error inesperado en el servidor";

  // Manejar errores específicos de Express/Node
  if (error.name === "CastError") {
    statusCode = 400;
    message = "ID inválido proporcionado";
  } else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Token inválido";
  } else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expirado";
  } else if (error.code === "ENOENT") {
    statusCode = 404;
    message = "Archivo o recurso no encontrado";
  } else if (error.type === "entity.parse.failed") {
    statusCode = 400;
    message = "JSON inválido en el cuerpo de la petición";
  }

  // Log del error con colores
  formatErrorLog(error, req, statusCode);

  // Mostrar stack trace solo en desarrollo
  const isDevelopment = process.env.NODE_ENV === "development";
  if (isDevelopment && error.stack) {
    console.error(colorize("  ├─ Stack trace:", colors.gray));
    console.error(colorize(error.stack, colors.gray));
  }

  // Línea separadora
  console.error(colorize("  └─" + "─".repeat(60), colors.gray));

  // Preparar respuesta
  const errorResponse = {
    status: "error",
    statusCode,
    message,
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
    method: req.method,
  };

  // Agregar información adicional en desarrollo
  if (isDevelopment) {
    errorResponse.stack = error.stack;
    errorResponse.error = {
      name: error.name,
      isOperational: error.isOperational,
    };

    if (error.errors) {
      errorResponse.validationErrors = error.errors;
    }
  }

  // Enviar respuesta
  res.status(statusCode).json(errorResponse);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
};
