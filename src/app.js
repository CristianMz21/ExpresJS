require("dotenv").config({ path: ".env" });

const express = require("express");
const path = require("path");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const routes = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de la vista
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(morgan("dev")); // Logging
app.use(helmet()); // Seguridad
app.use(cors()); // CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Rutas
app.use("/", routes);

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).send("404 - Not Found");
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("500 - Server Error");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
