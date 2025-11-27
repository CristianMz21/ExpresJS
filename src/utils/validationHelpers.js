/**
 * Utilidades de validación para controladores
 * Funciones helper que combinan validadores básicos y lanzan errores apropiados
 */

const {
  validateUserData,
  validateId,
  validateName,
  validateEmail,
} = require("./validators");
const { ValidationError } = require("./errorHelpers");

/**
 * Valida el ID del parámetro de ruta
 * @param {string} id - ID a validar
 * @throws {ValidationError} Si el ID es inválido
 * @example
 * validateParamId(req.params.id);
 */
const validateParamId = (id) => {
  const idValidation = validateId(id);
  if (!idValidation.valid) {
    throw new ValidationError("ID inválido", [idValidation.error]);
  }
};

/**
 * Valida los datos completos del usuario (name y email)
 * @param {string} name - Nombre del usuario
 * @param {string} email - Email del usuario
 * @throws {ValidationError} Si los datos son inválidos
 * @example
 * validateCompleteUserData(req.body.name, req.body.email);
 */
const validateCompleteUserData = (name, email) => {
  const validation = validateUserData(name, email);
  if (!validation.valid) {
    throw new ValidationError("Datos de usuario inválidos", [validation.error]);
  }
};

/**
 * Valida y prepara las actualizaciones parciales del usuario
 * @param {Object} data - Datos a validar { name, email }
 * @returns {Object} Objeto con updates válidos y errores
 * @example
 * const { updates, errors } = validatePartialUpdates(req.body);
 * if (errors.length > 0) {
 *   throw new ValidationError("Errores de validación", errors);
 * }
 */
const validatePartialUpdates = (data) => {
  const { name, email } = data;
  const updates = {};
  const errors = [];

  if (name !== undefined) {
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      errors.push(nameValidation.error);
    } else {
      updates.name = name.trim();
    }
  }

  if (email !== undefined) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      errors.push(emailValidation.error);
    } else {
      updates.email = email.trim();
    }
  }

  return { updates, errors };
};

/**
 * Valida que al menos un campo esté presente para actualización
 * @param {Object} data - Datos a validar
 * @param {Array<string>} fields - Campos a verificar
 * @throws {ValidationError} Si no hay campos presentes
 * @example
 * validateAtLeastOneField(req.body, ['name', 'email']);
 */
const validateAtLeastOneField = (data, fields) => {
  const hasAtLeastOne = fields.some((field) => data[field] !== undefined);

  if (!hasAtLeastOne) {
    throw new ValidationError("Datos insuficientes", [
      `Se requiere al menos uno de los siguientes campos: ${fields.join(", ")}`,
    ]);
  }
};

/**
 * Valida y sanitiza datos de usuario para creación/actualización
 * @param {Object} data - Datos del usuario
 * @param {boolean} requireAll - Si se requieren todos los campos
 * @returns {Object} Datos validados y sanitizados
 * @throws {ValidationError} Si hay errores de validación
 */
const validateAndSanitizeUserData = (data, requireAll = true) => {
  const { name, email } = data;
  const errors = [];
  const sanitized = {};

  if (requireAll || name !== undefined) {
    const nameValidation = validateName(name);
    if (!nameValidation.valid) {
      errors.push(nameValidation.error);
    } else {
      sanitized.name = name.trim();
    }
  }

  if (requireAll || email !== undefined) {
    const emailValidation = validateEmail(email);
    if (!emailValidation.valid) {
      errors.push(emailValidation.error);
    } else {
      sanitized.email = email.trim().toLowerCase();
    }
  }

  if (errors.length > 0) {
    throw new ValidationError("Errores de validación", errors);
  }

  return sanitized;
};

module.exports = {
  validateParamId,
  validateCompleteUserData,
  validatePartialUpdates,
  validateAtLeastOneField,
  validateAndSanitizeUserData,
};
