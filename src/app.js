const express = require("express");
const path = require("path");
const routes = require("./routes/index");
const setupMiddlewares = require("./middlewares");

const app = express();

// Configuración de la vista
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
setupMiddlewares(app);

// Rutas
app.use("/", routes);

// Manejo de errores
const { notFoundHandler, errorHandler } = require("./middlewares/errorHandle");

// Manejo de errores 404
app.use(notFoundHandler);

// Manejo de errores de Prisma
const prismaErrorHandler = require("./middlewares/prismaErrorHandler");
app.use(prismaErrorHandler);

// Manejo de errores global
app.use(errorHandler);



module.exports = app;
