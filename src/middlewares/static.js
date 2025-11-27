const express = require("express");
const path = require("path");

/**
 * Configura middleware para servir archivos estáticos
 * @param {Express} app - Instancia de Express
 */
const setupStatic = (app) => {
  app.use(express.static(path.join(__dirname, "..", "public")));
};

module.exports = setupStatic;
