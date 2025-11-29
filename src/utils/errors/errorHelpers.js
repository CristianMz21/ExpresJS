const {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../../middlewares/errorHandle");

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

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

const sanitizeString = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.trim().replace(/[<>]/g, "");
};

const throwValidationErrors = (errors, message = "Errores de validación") => {
  if (errors && errors.length > 0) {
    throw new ValidationError(message, errors);
  }
};

const sanitizeInput = (data, allowedFields) => {
  if (!data || typeof data !== "object") return {};

  const sanitized = {};
  allowedFields.forEach((field) => {
    if (data[field] !== undefined) {
      sanitized[field] =
        typeof data[field] === "string" ? sanitizeString(data[field]) : data[field];
    }
  });

  return sanitized;
};

module.exports = {
  AppError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  catchAsync,
  validateRequiredFields,
  throwValidationErrors,
  sanitizeString,
  sanitizeInput,
};
