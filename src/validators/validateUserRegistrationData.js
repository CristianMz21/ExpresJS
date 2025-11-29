const { ValidationError } = require("../utils/errors/errorHelpers");
const { isValidUsername, isValidEmail } = require("../utils/validation/validators");

const PASSWORD_MIN_LENGTH = 6;

/**
 * Valida los datos de registro de usuario
 * @param {{ email: string, username: string, password: string }} userData
 * @returns {void}
 * @throws {ValidationError}
 */
const validateUserRegistrationData = (userData) => {
  const { email, username, password } = userData || {};

  const missing = [];
  if (!email) missing.push("email");
  if (!username) missing.push("username");
  if (!password) missing.push("password");
  if (missing.length > 0) {
    throw new ValidationError(
      "Faltan campos requeridos",
      missing.map((field) => `El campo '${field}' es requerido`)
    );
  }

  if (!isValidEmail(email)) {
    throw new ValidationError("El formato del email no es válido");
  }
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new ValidationError(
      `La contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`
    );
  }
  if (!isValidUsername(username)) {
    throw new ValidationError(
      "El nombre de usuario debe tener entre 2 y 50 caracteres y solo contener letras, números, guiones o guiones bajos"
    );
  }
};

module.exports = validateUserRegistrationData;
