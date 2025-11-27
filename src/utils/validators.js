/**
 * Utilidades de validación para datos de usuario
 * Proporciona funciones para validar nombres, emails, IDs y datos completos
 */

// Expresiones regulares para validación
const REGEX = {
  // Nombre: letras, espacios, acentos, ñ (mínimo 2 caracteres)
  name: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
  
  // Email: formato estándar RFC 5322 simplificado
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  
  // ID: solo números positivos
  id: /^[1-9][0-9]*$/,
};

// Constantes de validación
const VALIDATION_RULES = {
  name: {
    minLength: 2,
    maxLength: 50,
  },
  email: {
    minLength: 5,
    maxLength: 100,
  },
  id: {
    min: 1,
    max: Number.MAX_SAFE_INTEGER,
  },
};

/**
 * Valida el nombre de un usuario
 * @param {string} name - Nombre a validar
 * @returns {Object} { valid: boolean, error?: string }
 */
const validateName = (name) => {
  // Verificar que existe
  if (!name) {
    return {
      valid: false,
      error: "El nombre es requerido",
    };
  }

  // Verificar tipo
  if (typeof name !== "string") {
    return {
      valid: false,
      error: "El nombre debe ser una cadena de texto",
    };
  }

  // Limpiar espacios
  const trimmedName = name.trim();

  // Verificar longitud mínima
  if (trimmedName.length < VALIDATION_RULES.name.minLength) {
    return {
      valid: false,
      error: `El nombre debe tener al menos ${VALIDATION_RULES.name.minLength} caracteres`,
    };
  }

  // Verificar longitud máxima
  if (trimmedName.length > VALIDATION_RULES.name.maxLength) {
    return {
      valid: false,
      error: `El nombre no puede exceder ${VALIDATION_RULES.name.maxLength} caracteres`,
    };
  }

  // Verificar formato
  if (!REGEX.name.test(trimmedName)) {
    return {
      valid: false,
      error: "El nombre solo puede contener letras y espacios",
    };
  }

  return { valid: true };
};

/**
 * Valida el email de un usuario
 * @param {string} email - Email a validar
 * @returns {Object} { valid: boolean, error?: string }
 */
const validateEmail = (email) => {
  // Verificar que existe
  if (!email) {
    return {
      valid: false,
      error: "El email es requerido",
    };
  }

  // Verificar tipo
  if (typeof email !== "string") {
    return {
      valid: false,
      error: "El email debe ser una cadena de texto",
    };
  }

  // Limpiar espacios
  const trimmedEmail = email.trim();

  // Verificar longitud mínima
  if (trimmedEmail.length < VALIDATION_RULES.email.minLength) {
    return {
      valid: false,
      error: "El email es demasiado corto",
    };
  }

  // Verificar longitud máxima
  if (trimmedEmail.length > VALIDATION_RULES.email.maxLength) {
    return {
      valid: false,
      error: `El email no puede exceder ${VALIDATION_RULES.email.maxLength} caracteres`,
    };
  }

  // Verificar formato
  if (!REGEX.email.test(trimmedEmail)) {
    return {
      valid: false,
      error: "El formato del email no es válido",
    };
  }

  return { valid: true };
};

/**
 * Valida un ID numérico
 * @param {string|number} id - ID a validar
 * @returns {Object} { valid: boolean, error?: string }
 */
const validateId = (id) => {
  // Verificar que existe
  if (id === undefined || id === null || id === "") {
    return {
      valid: false,
      error: "El ID es requerido",
    };
  }

  // Convertir a string para validación
  const idString = String(id);

  // Verificar formato (solo números, no puede empezar con 0)
  if (!REGEX.id.test(idString)) {
    return {
      valid: false,
      error: "El ID debe ser un número positivo válido",
    };
  }

  // Convertir a número para validación de rango
  const idNumber = parseInt(idString, 10);

  // Verificar que es un número válido
  if (isNaN(idNumber)) {
    return {
      valid: false,
      error: "El ID no es un número válido",
    };
  }

  // Verificar rango mínimo
  if (idNumber < VALIDATION_RULES.id.min) {
    return {
      valid: false,
      error: "El ID debe ser mayor a 0",
    };
  }

  // Verificar rango máximo (evitar overflow)
  if (idNumber > VALIDATION_RULES.id.max) {
    return {
      valid: false,
      error: "El ID excede el valor máximo permitido",
    };
  }

  return { valid: true };
};

/**
 * Valida los datos completos de un usuario (nombre y email)
 * @param {string} name - Nombre del usuario
 * @param {string} email - Email del usuario
 * @returns {Object} { valid: boolean, error?: string, errors?: Array }
 */
const validateUserData = (name, email) => {
  const errors = [];

  // Validar nombre
  const nameValidation = validateName(name);
  if (!nameValidation.valid) {
    errors.push(nameValidation.error);
  }

  // Validar email
  const emailValidation = validateEmail(email);
  if (!emailValidation.valid) {
    errors.push(emailValidation.error);
  }

  // Si hay errores, retornar el primero (para compatibilidad)
  if (errors.length > 0) {
    return {
      valid: false,
      error: errors[0],
      errors: errors,
    };
  }

  return { valid: true };
};

/**
 * Valida una cadena de texto genérica
 * @param {string} value - Valor a validar
 * @param {Object} options - Opciones de validación
 * @param {number} options.minLength - Longitud mínima
 * @param {number} options.maxLength - Longitud máxima
 * @param {string} options.fieldName - Nombre del campo para mensajes
 * @returns {Object} { valid: boolean, error?: string }
 */
const validateString = (value, options = {}) => {
  const {
    minLength = 1,
    maxLength = 255,
    fieldName = "El campo",
  } = options;

  if (!value || typeof value !== "string") {
    return {
      valid: false,
      error: `${fieldName} es requerido`,
    };
  }

  const trimmedValue = value.trim();

  if (trimmedValue.length < minLength) {
    return {
      valid: false,
      error: `${fieldName} debe tener al menos ${minLength} caracteres`,
    };
  }

  if (trimmedValue.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} no puede exceder ${maxLength} caracteres`,
    };
  }

  return { valid: true };
};

module.exports = {
  validateName,
  validateEmail,
  validateId,
  validateUserData,
  validateString,
  REGEX,
  VALIDATION_RULES,
};
