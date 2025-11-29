const express = require("express");
const router = express.Router();

const mainRoutes = require("./main");
const usersRoutes = require("./users");
const dbUsersRoutes = require("./dbUsers");

// Main routes
router.use("/", mainRoutes);

// User routes (JSON file based)
router.use("/users", usersRoutes);

// Database User routes (Prisma based)
router.use("/db-users", dbUsersRoutes);

module.exports = router;
