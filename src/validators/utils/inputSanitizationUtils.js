/**
 * Utilidades de sanitización de entrada
 */
const sanitizeString = (str) => {
  if (!str || typeof str !== "string") return "";
  return str.trim().replace(/[<>]/g, "");
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
  sanitizeString,
  sanitizeInput,
};
