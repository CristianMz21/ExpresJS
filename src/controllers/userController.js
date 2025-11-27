const userService = require("../services/userService");
const {
  validateParamId,
  validateCompleteUserData,
  validatePartialUpdates,
  validateAtLeastOneField,
} = require("../utils/validationHelpers");
const { catchAsync, ValidationError } = require("../utils/errorHelpers");

/**
 * GET /api/users
 * Obtiene todos los usuarios
 */
const getUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

/**
 * GET /api/users/:id
 * Obtiene un usuario por ID
 */
const getUserById = catchAsync(async (req, res) => {
  const { id } = req.params;

  validateParamId(id);
  const user = await userService.getUserById(id);

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

/**
 * POST /api/users
 * Crea un nuevo usuario
 */
const createUser = catchAsync(async (req, res) => {
  const { name, email } = req.body;

  validateCompleteUserData(name, email);

  const newUser = await userService.createUser({ name, email });

  res.status(201).json({
    status: "success",
    message: "Usuario creado exitosamente",
    data: { user: newUser },
  });
});

/**
 * PUT /api/users/:id
 * Reemplaza completamente un usuario
 */
const putUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  validateParamId(id);
  validateCompleteUserData(name, email);

  const updatedUser = await userService.replaceUser(id, { name, email });

  res.status(200).json({
    status: "success",
    message: "Usuario reemplazado exitosamente",
    data: { user: updatedUser },
  });
});

/**
 * PATCH /api/users/:id
 * Actualiza parcialmente un usuario
 */
const patchUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;

  validateParamId(id);
  validateAtLeastOneField(req.body, ["name", "email"]);

  // Validar y preparar actualizaciones
  const { updates, errors } = validatePartialUpdates({ name, email });

  if (errors.length > 0) {
    throw new ValidationError("Errores de validación", errors);
  }

  const updatedUser = await userService.updateUser(id, updates);

  res.status(200).json({
    status: "success",
    message: "Usuario actualizado exitosamente",
    data: { user: updatedUser },
  });
});

/**
 * DELETE /api/users/:id
 * Elimina un usuario
 */
const deleteUser = catchAsync(async (req, res) => {
  const { id } = req.params;

  validateParamId(id);

  const deletedUser = await userService.deleteUser(id);

  res.status(200).json({
    status: "success",
    message: "Usuario eliminado exitosamente",
    data: { user: deletedUser },
  });
});

module.exports = {
  getUsers,
  getUserById,
  createUser,
  putUser,
  patchUser,
  deleteUser,
};
