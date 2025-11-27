const logger = require("./logger");
const setupSecurity = require("./security");
const setupParser = require("./parser");
const setupStatic = require("./static");

/**
 * Configura todos los middlewares de la aplicación
 * @param {Express} app - Instancia de Express
 */
const setupMiddlewares = (app) => {
  // Logger personalizado
  app.use(logger);

  // Seguridad (helmet, cors)
  setupSecurity(app);

  // Parseo de datos (JSON, URL-encoded)
  setupParser(app);

  // Archivos estáticos
  setupStatic(app);
};

module.exports = setupMiddlewares;
