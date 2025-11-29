const express = require("express");
const router = express.Router();
const {
  getAllDbUsers,
  getDbUserById,
  createDbUser,
  updateDbUser,
  updateDbUserPassword,
  deleteDbUser,
  loginDbUser,
} = require("../controllers/dbUserController");

const authenticateToken = require("../middlewares/auth");
const validateUuidParam = require("../middlewares/validateUuid");

// Login (Public)
router.post("/login", loginDbUser);

// Get all database users (Protected)
router.get("/", authenticateToken, getAllDbUsers);

// Get database user by ID
router.get("/:id", validateUuidParam("id"), getDbUserById);

// Create database user
router.post("/", createDbUser);

// Update database user
router.patch("/:id", validateUuidParam("id"), updateDbUser);

// Update database user password (temporarily without auth for testing)
router.patch("/:id/password", validateUuidParam("id"), updateDbUserPassword);

// Delete database user
router.delete("/:id", validateUuidParam("id"), deleteDbUser);

module.exports = router;
