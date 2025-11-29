const express = require("express");
const router = express.Router();

const {
  home,
  getUserById: getUserByIdMain,
  search,
  handleForm,
} = require("../controllers/mainController");

// Ruta principal
router.get("/", home);

// Ruta user/id (from mainController)
router.get("/user/:id", getUserByIdMain);

// Ruta de búsqueda con query parameters
router.get("/search", search);

// Forms
router.post("/form", handleForm);

module.exports = router;
