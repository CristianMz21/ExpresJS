const { ValidationError } = require("../../utils/errors/errorHelpers");

/**
 * Crea un validador sincrónico basado en un esquema simple
 * @param {Object} schema - Definición de campos
 * @returns {(data:Object)=>void}
 */
const createSchemaValidator = (schema) => (data) => {
  const errors = [];
  for (const [key, rules] of Object.entries(schema)) {
    const value = data?.[key];
    if (rules.required && (value === undefined || value === null || value === "")) {
      errors.push(`El campo '${key}' es requerido`);
      continue;
    }
    if (value !== undefined) {
      if (rules.type && typeof value !== rules.type) {
        errors.push(`El campo '${key}' debe ser de tipo ${rules.type}`);
      }
      if (typeof value === "string") {
        const trimmed = value.trim();
        if (rules.min && trimmed.length < rules.min) {
          errors.push(`El campo '${key}' debe tener al menos ${rules.min} caracteres`);
        }
        if (rules.max && trimmed.length > rules.max) {
          errors.push(`El campo '${key}' debe tener máximo ${rules.max} caracteres`);
        }
        if (rules.regex && !rules.regex.test(trimmed)) {
          errors.push(`El campo '${key}' no cumple el formato requerido`);
        }
      }
    }
  }
  if (errors.length) {
    throw new ValidationError("Errores de validación", errors);
  }
};

/**
 * Compone validadores sincrónicos
 * @param {Array<Function>} validators
 * @returns {(data:any)=>void}
 */
const composeValidators = (validators) => (data) => {
  validators.forEach((v) => v(data));
};

/**
 * Crea un validador asíncrono a partir de checks que retornan promesas
 * @param {Array<(data:any)=>Promise<void>>} asyncChecks
 * @returns {(data:any)=>Promise<void>}
 */
const createAsyncValidator = (asyncChecks) => async (data) => {
  for (const check of asyncChecks) {
    await check(data);
  }
};

module.exports = {
  createSchemaValidator,
  composeValidators,
  createAsyncValidator,
};
