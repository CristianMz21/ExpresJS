const { ValidationError } = require("../../utils/errors/errorHelpers");

/**
 * Verifica si al menos uno de los campos está presente en el objeto
 * @param {Object} data - Datos a validar
 * @param {string[]} fields - Lista de campos
 * @returns {boolean}
 */
const hasAtLeastOneField = (data, fields) => {
  return fields.some((field) => data[field] !== undefined);
};

/**
 * Lanza ValidationError si existen errores de validación
 * @param {string[]} errors - Lista de errores
 * @param {string} message - Mensaje principal
 */
const assertNoErrors = (errors, message = "Errores de validación") => {
  if (errors && errors.length > 0) {
    throw new ValidationError(message, errors);
  }
};

module.exports = {
  hasAtLeastOneField,
  assertNoErrors,
};
