/**
 * Utilidades para manejo de errores
 * Re-exporta las clases de error personalizadas y proporciona funciones helper
 */

const {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../middlewares/errorHandle");

/**
 * Envuelve funciones async para capturar errores automáticamente
 * @param {Function} fn - Función async a envolver
 * @returns {Function} Función envuelta con manejo de errores
 * @example
 * const getUser = catchAsync(async (req, res) => {
 *   const user = await User.findById(req.params.id);
 *   res.json(user);
 * });
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Valida que los campos requeridos estén presentes
 * @param {Object} data - Datos a validar
 * @param {Array<string>} requiredFields - Campos requeridos
 * @throws {ValidationError} Si faltan campos
 * @example
 * validateRequiredFields(req.body, ['name', 'email', 'password']);
 */
const validateRequiredFields = (data, requiredFields) => {
  if (!data || typeof data !== "object") {
    throw new ValidationError("Los datos proporcionados no son válidos");
  }

  const missingFields = requiredFields.filter(
    (field) => !data[field] || (typeof data[field] === "string" && !data[field].trim())
  );

  if (missingFields.length > 0) {
    throw new ValidationError(
      "Faltan campos requeridos",
      missingFields.map((field) => `El campo '${field}' es requerido`)
    );
  }
};



/**
 * Sanitiza una cadena de texto eliminando espacios y caracteres peligrosos
 * @param {string} str - Cadena a sanitizar
 * @returns {string} Cadena sanitizada
 */
const sanitizeString = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.trim().replace(/[<>]/g, "");
};

/**
 * Crea un error de validación con múltiples mensajes
 * @param {Array<string>} errors - Lista de errores
 * @param {string} message - Mensaje principal
 * @throws {ValidationError}
 */
const throwValidationErrors = (errors, message = "Errores de validación") => {
  if (errors && errors.length > 0) {
    throw new ValidationError(message, errors);
  }
};

/**
 * Valida y sanitiza datos de entrada
 * @param {Object} data - Datos a validar
 * @param {Array<string>} allowedFields - Campos permitidos
 * @returns {Object} Datos sanitizados
 */
const sanitizeInput = (data, allowedFields) => {
  if (!data || typeof data !== "object") return {};

  const sanitized = {};
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      sanitized[field] =
        typeof data[field] === "string"
          ? sanitizeString(data[field])
          : data[field];
    }
  });

  return sanitized;
};

module.exports = {
  // Clases de error
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,

  // Funciones de utilidad
  catchAsync,
  validateRequiredFields,
  throwValidationErrors,

  // Sanitización
  sanitizeString,
  sanitizeInput,
};

