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
 * Valida formato de email
 * @param {string} email - Email a validar
 * @returns {boolean} True si es válido
 * @example
 * if (!isValidEmail(user.email)) {
 *   throw new ValidationError('Email inválido');
 * }
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Valida que un ID sea válido (numérico o UUID)
 * @param {string|number} id - ID a validar
 * @returns {boolean} True si es válido
 * @example
 * if (!isValidId(req.params.id)) {
 *   throw new ValidationError('ID inválido');
 * }
 */
const isValidId = (id) => {
  if (id === undefined || id === null || id === "") return false;

  // Validar ID numérico positivo
  if (!isNaN(id) && Number(id) > 0 && Number.isInteger(Number(id))) {
    return true;
  }

  // Validar UUID v4
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(String(id));
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
 * Valida que un valor sea un número positivo
 * @param {any} value - Valor a validar
 * @returns {boolean} True si es un número positivo
 */
const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0 && isFinite(num);
};

/**
 * Valida que un valor sea un número entero
 * @param {any} value - Valor a validar
 * @returns {boolean} True si es un número entero
 */
const isInteger = (value) => {
  return Number.isInteger(Number(value));
};

/**
 * Valida longitud de cadena
 * @param {string} str - Cadena a validar
 * @param {number} min - Longitud mínima
 * @param {number} max - Longitud máxima
 * @returns {boolean} True si cumple con la longitud
 */
const isValidLength = (str, min = 0, max = Infinity) => {
  if (typeof str !== "string") return false;
  const length = str.trim().length;
  return length >= min && length <= max;
};

/**
 * Valida que un objeto tenga al menos una propiedad
 * @param {Object} obj - Objeto a validar
 * @returns {boolean} True si tiene propiedades
 */
const hasProperties = (obj) => {
  return obj && typeof obj === "object" && Object.keys(obj).length > 0;
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

  // Validadores
  isValidEmail,
  isValidId,
  isPositiveNumber,
  isInteger,
  isValidLength,
  hasProperties,

  // Sanitización
  sanitizeString,
  sanitizeInput,
};
