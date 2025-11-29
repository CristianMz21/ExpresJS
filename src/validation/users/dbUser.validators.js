const {
  ValidationError,
  sanitizeInput,
} = require("../../utils/errors/errorHelpers");

const {
  isValidUsername,
  isValidEmail,
} = require("../../utils/validation/validators");

const PASSWORD_MIN_LENGTH = 6;
const ALLOWED_UPDATE_FIELDS = ["email", "username", "role"];

const validateCreateUser = (data) => {
  const { email, username, password } = data;
  if (!email || !username || !password) {
    const missing = [];
    if (!email) missing.push("email");
    if (!username) missing.push("username");
    if (!password) missing.push("password");
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

const validateUpdateUser = (updates) => {
  const sanitized = sanitizeInput(updates, ALLOWED_UPDATE_FIELDS);
  if (Object.keys(sanitized).length === 0) {
    throw new ValidationError(
      "No se proporcionaron campos válidos para actualizar",
      ["Los campos permitidos son: " + ALLOWED_UPDATE_FIELDS.join(", ")]
    );
  }
  if (sanitized.email && !isValidEmail(sanitized.email)) {
    throw new ValidationError("El formato del email no es válido");
  }
  if (sanitized.username && !isValidUsername(sanitized.username)) {
    throw new ValidationError(
      "El nombre de usuario debe tener entre 2 y 50 caracteres y solo contener letras, números, guiones o guiones bajos"
    );
  }
  return sanitized;
};

const validatePasswordChange = (data) => {
  const { currentPassword, newPassword } = data;
  if (!currentPassword || !newPassword) {
    throw new ValidationError("Se requieren la contraseña actual y la nueva");
  }
  if (newPassword.length < PASSWORD_MIN_LENGTH) {
    throw new ValidationError(
      `La nueva contraseña debe tener al menos ${PASSWORD_MIN_LENGTH} caracteres`
    );
  }
};

const validateLogin = (credentials) => {
  const { email, password } = credentials;
  if (!email || !password) {
    throw new ValidationError("Email y contraseña son requeridos");
  }
  if (!isValidEmail(email)) {
    throw new ValidationError("El formato del email no es válido");
  }
};

module.exports = {
  validateCreateUser,
  validateUpdateUser,
  validatePasswordChange,
  validateLogin,
  ALLOWED_UPDATE_FIELDS,
};
