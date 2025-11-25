const express = require("express");
const router = express.Router();

const {
  home,
  getUserById,
  search,
  handleForm,
} = require("../controllers/mainController");
const { getUsers, createUser, putUser, patchUser, deleteUser } = require("../controllers/userController");

// Ruta principal
router.get("/", home);

// Ruta user/id
router.get("/user/:id", getUserById);

// Ruta de búsqueda con query parameters
router.get("/search", search);

// Forms
router.post("/form", handleForm);

// Get User
router.get("/users", getUsers);

// Post User
router.post("/users", createUser);

// Put User (Full Replacement)
router.put("/users/:id", putUser);

// Patch User (Partial Update)
router.patch("/users/:id", patchUser);

// Delete User
router.delete("/users/:id", deleteUser);

module.exports = router;
