const fs = require("fs");
const path = require("path");


async function readFile(filePath) {
  try {
    const data = await fs.promises.readFile(path.join(process.cwd(), filePath), "utf-8");
    return data;
  } catch (error) {
    console.error("Error reading file:", error);
    return null;
  }
}


async function writeFile(filePath, content) {
  try {
    await fs.promises.writeFile(path.join(process.cwd(), filePath), content, "utf-8");
    console.log("File written successfully");
  } catch (error) {
    console.error("Error writing file:", error);
  }
}

module.exports = {
  readFile,
  writeFile,
};
