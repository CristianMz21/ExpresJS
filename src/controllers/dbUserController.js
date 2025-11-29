const { catchAsync, ValidationError } = require("../utils/errors/errorHelpers");
const { isUuid } = require("../utils/validation/validators");
const dbUserService = require("../services/dbUserService");
const {
  validateCreateUser: validateUserRegistrationData,
  validateUpdateUser: validateUserProfileUpdates,
  validatePasswordChange: validateUserPasswordChange,
  validateLogin: validateUserLoginCredentials,
} = require("../validation/users/dbUser.validators");

/**
 * Database User Controller
 * Handles user operations via DbUserService
 */

const ensureValidUuid = (id) => {
  if (!isUuid(String(id))) {
    throw new ValidationError("El ID proporcionado no es válido");
  }
};

/**
 * GET /api/db-users
 * Retrieves all users from database
 */
const getAllDbUsers = catchAsync(async (req, res) => {
  const users = await dbUserService.getAllUsers();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users },
  });
});

/**
 * GET /api/db-users/:id
 * Retrieves a single user by ID
 */
const getDbUserById = catchAsync(async (req, res) => {
  const { id } = req.params;
  ensureValidUuid(id);

  const user = await dbUserService.getUserById(id);

  res.status(200).json({
    status: "success",
    data: { user },
  });
});

/**
 * POST /api/db-users
 * Creates a new user in the database
 */
const createDbUser = catchAsync(async (req, res) => {
  // Validate input
  validateUserRegistrationData(req.body);

  // Create user via service
  const user = await dbUserService.createUser(req.body);

  res.status(201).json({
    status: "success",
    message: "Usuario creado exitosamente",
    data: { user },
  });
});

/**
 * PATCH /api/db-users/:id
 * Updates a user (partial update)
 */
const updateDbUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  ensureValidUuid(id);

  // Validate and sanitize input
  const sanitizedUpdates = validateUserProfileUpdates(req.body);

  // Update via service
  const user = await dbUserService.updateUser(id, sanitizedUpdates);

  res.status(200).json({
    status: "success",
    message: "Usuario actualizado exitosamente",
    data: { user },
  });
});

/**
 * PATCH /api/db-users/:id/password
 * Updates user password
 */
const updateDbUserPassword = catchAsync(async (req, res) => {
  const { id } = req.params;
  ensureValidUuid(id);

  // Validate input
  validateUserPasswordChange(req.body);

  const { currentPassword, newPassword } = req.body;

  // Update password via service
  await dbUserService.updatePassword(id, currentPassword, newPassword);

  res.status(200).json({
    status: "success",
    message: "Contraseña actualizada exitosamente",
  });
});

/**
 * DELETE /api/db-users/:id
 * Deletes a user
 */
const deleteDbUser = catchAsync(async (req, res) => {
  const { id } = req.params;
  ensureValidUuid(id);

  await dbUserService.deleteUser(id);

  res.status(204).send();
});

/**
 * POST /api/db-users/login
 * Authenticates a user and returns JWT token
 */
const loginDbUser = catchAsync(async (req, res) => {
  // Validate input
  validateUserLoginCredentials(req.body);

  const { email, password } = req.body;

  // Authenticate via service
  const { user, token } = await dbUserService.authenticateUser(email, password);

  res.status(200).json({
    status: "success",
    message: "Login exitoso",
    token,
    data: user,
  });
});

// ==================== EXPORTS ====================

module.exports = {
  getAllDbUsers,
  getDbUserById,
  createDbUser,
  updateDbUser,
  updateDbUserPassword,
  deleteDbUser,
  loginDbUser,
};
