const fs = require("fs").promises;

const readFile = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, "utf-8");
    return data;
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    return null;
  }
};

const writeFile = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, data, "utf-8");
  } catch (error) {
    console.error(`Error writing file: ${filePath}`, error);
    throw error;
  }
};

module.exports = { readFile, writeFile };
