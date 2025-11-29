const express = require("express");
const router = express.Router();
const { getUsers, getUserById, createUser, putUser, patchUser, deleteUser } = require("../controllers/userController");

// Get Users (all)
router.get("/", getUsers);

// Get User by ID (from userController)
router.get("/:id", getUserById);

// Post User
router.post("/", createUser);

// Put User (Full Replacement)
router.put("/:id", putUser);

// Patch User (Partial Update)
router.patch("/:id", patchUser);

// Delete User
router.delete("/:id", deleteUser);

module.exports = router;
