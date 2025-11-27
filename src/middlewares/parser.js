const express = require("express");

/**
 * Configura middlewares de parseo de datos
 * @param {Express} app - Instancia de Express
 */
const setupParser = (app) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

module.exports = setupParser;
