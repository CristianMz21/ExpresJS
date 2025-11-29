/**
 * Generic Validation Utilities
 * Pure functions that return boolean or simple validation results.
 * No business logic or error throwing here.
 */

// Regular expressions
const REGEX = {
  // Name: letters, spaces, accents, ñ (min 2 chars)
  name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
  
  // Email: standard RFC 5322 simplified
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // ID: positive numbers only
  id: /^[1-9][0-9]*$/,
  
  // UUID v4
  uuid: /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
  
  // Username: alphanumeric, underscores, hyphens (min 2 chars)
  username: /^[a-zA-Z0-9_-]{2,50}$/
};

/**
 * Validates if a string matches name format
 * @param {string} name 
 * @returns {boolean}
 */
const isValidName = (name) => {
  if (!name || typeof name !== "string") return false;
  return REGEX.name.test(name.trim());
};

/**
 * Validates if a string matches username format
 * @param {string} username 
 * @returns {boolean}
 */
const isValidUsername = (username) => {
  if (!username || typeof username !== "string") return false;
  return REGEX.username.test(username.trim());
};

/**
 * Validates email format
 * @param {string} email 
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  if (!email || typeof email !== "string") return false;
  return REGEX.email.test(email.trim());
};

/**
 * Validates if ID is a positive integer or UUID
 * @param {string|number} id 
 * @returns {boolean}
 */
const isValidId = (id) => {
  if (id === undefined || id === null || id === "") return false;

  // Check numeric ID
  if (!isNaN(id) && Number(id) > 0 && Number.isInteger(Number(id))) {
    return true;
  }

  // Check UUID (any standard version)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(String(id));
};

/**
 * Validates if a value is a positive number
 * @param {any} value 
 * @returns {boolean}
 */
const isPositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0 && isFinite(num);
};

/**
 * Checks if string length is within range
 * @param {string} str 
 * @param {number} min 
 * @param {number} max 
 * @returns {boolean}
 */
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
  REGEX
};
