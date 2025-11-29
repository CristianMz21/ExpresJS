const REGEX = {
  name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  id: /^[1-9][0-9]*$/,
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i,
  username: /^[a-zA-Z0-9_-]{2,50}$/,
};

const isValidName = (name) => {
  if (!name || typeof name !== "string") return false;
  return REGEX.name.test(name.trim());
};

const isValidUsername = (username) => {
  if (!username || typeof username !== "string") return false;
  return REGEX.username.test(username.trim());
};

const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  return REGEX.email.test(email.trim());
};

const isValidId = (id) => {
  if (id === undefined || id === null || id === "") return false;
  if (!isNaN(id) && Number(id) > 0 && Number.isInteger(Number(id))) return true;
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(String(id));
};

const isUuid = (id) => {
  if (!id || typeof id !== "string") return false;
  const anyUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return anyUuid.test(id);
};

const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0 && isFinite(num);
};

const isValidLength = (str, min = 0, max = Infinity) => {
  if (typeof str !== "string") return false;
  const length = str.trim().length;
  return length >= min && length <= max;
};

module.exports = {
  isValidName,
  isValidUsername,
  isValidEmail,
  isValidId,
  isPositiveNumber,
  isValidLength,
  REGEX,
  isUuid,
};
