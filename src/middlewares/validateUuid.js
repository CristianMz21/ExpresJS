const { ValidationError } = require("../utils/errors/errorHelpers");
const { isUuid } = require("../utils/validation/validators");

const validateUuidParam = (paramName = "id") => (req, res, next) => {
  const id = req.params[paramName];
  if (!isUuid(String(id))) {
    return next(new ValidationError("El ID proporcionado no es válido"));
  }
  next();
};

module.exports = validateUuidParam;
