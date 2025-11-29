const { REGEX } = require("../../utils/validation/validators");

/**
 * Esquema de registro de usuario para validación estructural
 */
const userRegistrationSchema = {
  email: {
    type: "string",
    regex: REGEX.email,
    required: true,
  },
  username: {
    type: "string",
    regex: REGEX.username,
    required: true,
    min: 2,
    max: 50,
  },
  password: {
    type: "string",
    required: true,
    min: 6,
  },
};

module.exports = userRegistrationSchema;
