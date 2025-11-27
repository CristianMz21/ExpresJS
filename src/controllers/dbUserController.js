const prisma = require("../utils/prismaClient");
const { catchAsync } = require("../utils/errorHelpers");

/**
 * Controlador para manejar operaciones de usuarios desde la base de datos con Prisma
 * Separado del userController.js que usa archivos JSON
 */

/**
 * GET /api/db-users
 * Obtiene todos los usuarios desde la base de datos
 */
const getAllDbUsers = catchAsync(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      // Excluir password por seguridad
    },
  });

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

/**
 * GET /api/db-users/:id
 * Obtiene un usuario por ID desde la base de datos
 */
const getDbUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return res.status(404).json({
      status: "fail",
      message: "Usuario no encontrado",
    });
  }

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

/**
 * POST /api/db-users
 * Crea un nuevo usuario en la base de datos
 */
const createDbUser = catchAsync(async (req, res) => {
  const { email, username, password, role = "USER" } = req.body;

  // Validación básica
  if (!email || !username || !password) {
    return res.status(400).json({
      status: "fail",
      message: "Email, username y password son requeridos",
    });
  }

  // Crear usuario
  const user = await prisma.user.create({
    data: {
      email,
      username,
      password, // TODO: Hashear con bcrypt en producción
      role,
    },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(201).json({
    status: "success",
    message: "Usuario creado exitosamente",
    data: { user },
  });
});

/**
 * PATCH /api/db-users/:id
 * Actualiza un usuario existente
 */
const updateDbUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  // No permitir actualizar el password sin validación adicional
  delete updates.password;

  const user = await prisma.user.update({
    where: { id },
    data: updates,
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  res.status(200).json({
    status: "success",
    message: "Usuario actualizado exitosamente",
    data: { user },
  });
});

/**
 * DELETE /api/db-users/:id
 * Elimina un usuario
 */
const deleteDbUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id },
  });

  res.status(204).send();
});

module.exports = {
  getAllDbUsers,
  getDbUserById,
  createDbUser,
  updateDbUser,
  deleteDbUser,
};
