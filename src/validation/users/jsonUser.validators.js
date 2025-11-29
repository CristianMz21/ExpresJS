const { ValidationError } = require("../../utils/errors/errorHelpers");
const {
  isValidName,
  isValidEmail,
  isValidId,
} = require("../../utils/validation/validators");

const RULES = {
  name: { min: 2, max: 50 },
  email: { min: 5, max: 100 },
};

const validateParamId = (id) => {
  if (!isValidId(id)) {
    throw new ValidationError("ID inválido", [
      "El ID debe ser un número positivo o UUID válido",
    ]);
  }
};

const validateCompleteUserData = (name, email) => {
  const errors = [];
  if (!isValidName(name)) {
    errors.push(
      "El nombre es requerido y debe tener entre 2 y 50 caracteres"
    );
  }
  if (!isValidEmail(email)) {
    errors.push("El email es requerido y debe tener un formato válido");
  }
  if (errors.length > 0) {
    throw new ValidationError("Datos de usuario inválidos", errors);
  }
};

const validatePartialUpdates = (data) => {
  const { name, email } = data;
  const updates = {};
  const errors = [];
  if (name !== undefined) {
    if (!isValidName(name)) {
      errors.push("El nombre debe tener entre 2 y 50 caracteres");
    } else {
      updates.name = name.trim();
    }
  }
  if (email !== undefined) {
    if (!isValidEmail(email)) {
      errors.push("El email debe tener un formato válido");
    } else {
      updates.email = email.trim();
    }
  }
  return { updates, errors };
};

const validateAtLeastOneField = (data, fields) => {
  const hasAtLeastOne = fields.some((field) => data[field] !== undefined);
  if (!hasAtLeastOne) {
    throw new ValidationError("Datos insuficientes", [
      `Se requiere al menos uno de los siguientes campos: ${fields.join(", ")}`,
    ]);
  }
};

module.exports = {
  validateParamId,
  validateCompleteUserData,
  validatePartialUpdates,
  validateAtLeastOneField,
  RULES,
};
