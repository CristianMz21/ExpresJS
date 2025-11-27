const express = require("express");
const router = express.Router();

const {
  home,
  getUserById: getUserByIdMain,
  search,
  handleForm,
} = require("../controllers/mainController");
const { getUsers, getUserById, createUser, putUser, patchUser, deleteUser } = require("../controllers/userController");

// Ruta principal
router.get("/", home);

// Ruta user/id (from mainController)
router.get("/user/:id", getUserByIdMain);

// Ruta de búsqueda con query parameters
router.get("/search", search);

// Forms
router.post("/form", handleForm);

// Get Users (all)
router.get("/users", getUsers);

// Get User by ID (from userController)
router.get("/users/:id", getUserById);

// Post User
router.post("/users", createUser);

// Put User (Full Replacement)
router.put("/users/:id", putUser);

// Patch User (Partial Update)
router.patch("/users/:id", patchUser);

// Delete User
router.delete("/users/:id", deleteUser);

// ============================================
// Database Users Routes (usando Prisma)
// ============================================
const {
  getAllDbUsers,
  getDbUserById,
  createDbUser,
  updateDbUser,
  deleteDbUser,
} = require("../controllers/dbUserController");

// Get all database users
router.get("/db-users", getAllDbUsers);

// Get database user by ID
router.get("/db-users/:id", getDbUserById);

// Create database user
router.post("/db-users", createDbUser);

// Update database user
router.patch("/db-users/:id", updateDbUser);

// Delete database user
router.delete("/db-users/:id", deleteDbUser);

module.exports = router;
