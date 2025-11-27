/**
 * EJEMPLO DE USO DEL SISTEMA DE MANEJO DE ERRORES
 * 
 * Este archivo muestra cómo usar las clases de error personalizadas
 * y las utilidades de validación en tus controladores.
 */

const {
  NotFoundError,
  ValidationError,
  ConflictError,
  catchAsync,
  validateRequiredFields,
  isValidEmail,
} = require("../src/utils/errors");

// ============================================
// EJEMPLO 1: Uso básico de catchAsync
// ============================================
const getUserById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  // Simular búsqueda en base de datos
  const user = await findUserInDatabase(id);

  if (!user) {
    // Lanzar error personalizado - será capturado automáticamente
    throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
  }

  res.json({
    status: "success",
    data: { user },
  });
});

// ============================================
// EJEMPLO 2: Validación de campos requeridos
// ============================================
const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  // Validar campos requeridos
  validateRequiredFields(req.body, ["name", "email", "password"]);

  // Validar formato de email
  if (!isValidEmail(email)) {
    throw new ValidationError("Email inválido", ["El formato del email no es válido"]);
  }

  // Verificar si el usuario ya existe
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new ConflictError("El email ya está registrado");
  }

  // Crear usuario
  const newUser = await createUserInDatabase({ name, email, password });

  res.status(201).json({
    status: "success",
    data: { user: newUser },
  });
});

// ============================================
// EJEMPLO 3: Múltiples errores de validación
// ============================================
const updateUser = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  const errors = [];

  // Validar múltiples campos
  if (email && !isValidEmail(email)) {
    errors.push("El formato del email no es válido");
  }

  if (age && (age < 18 || age > 120)) {
    errors.push("La edad debe estar entre 18 y 120 años");
  }

  if (name && name.length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres");
  }

  // Si hay errores, lanzar ValidationError
  if (errors.length > 0) {
    throw new ValidationError("Errores de validación", errors);
  }

  // Actualizar usuario
  const updatedUser = await updateUserInDatabase(id, { name, email, age });

  if (!updatedUser) {
    throw new NotFoundError(`Usuario con ID ${id} no encontrado`);
  }

  res.json({
    status: "success",
    data: { user: updatedUser },
  });
});

// ============================================
// EJEMPLO 4: Manejo de errores en rutas
// ============================================
const express = require("express");
const router = express.Router();

// Las rutas usan catchAsync para manejar errores automáticamente
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);

// ============================================
// Funciones simuladas (reemplazar con tu lógica real)
// ============================================
async function findUserInDatabase(id) {
  // Simular búsqueda en DB
  return null;
}

async function findUserByEmail(email) {
  // Simular búsqueda en DB
  return null;
}

async function createUserInDatabase(userData) {
  // Simular creación en DB
  return { id: 1, ...userData };
}

async function updateUserInDatabase(id, userData) {
  // Simular actualización en DB
  return { id, ...userData };
}

module.exports = router;
