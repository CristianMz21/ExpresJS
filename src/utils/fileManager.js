const fs = require("fs").promises;

/**
 * Lee el contenido de un archivo
 * @param {string} filePath - Ruta del archivo a leer
 * @returns {Promise<string>} Contenido del archivo
 */
const readFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return data;
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return null;
  }
};

/**
 * Escribe contenido en un archivo
 * @param {string} filePath - Ruta del archivo a escribir
 * @param {string} data - Contenido a escribir
 * @returns {Promise<void>}
 */
const writeFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, data, "utf-8");
  } catch (error) {
    console.error(`Error writing file: ${filePath}`, error);
    throw error;
  }
};

module.exports = { readFile, writeFile };
