const helmet = require("helmet");
const cors = require("cors");

/**
 * Configura middlewares de seguridad
 * @param {Express} app - Instancia de Express
 */
const setupSecurity = (app) => {
  app.use(helmet()); // Seguridad HTTP headers
  app.use(cors()); // CORS
};

module.exports = setupSecurity;
