require("dotenv").config({ path: ".env" });

const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // ruta a tus plantillas

app.use(express.static(path.join(__dirname, "public"))); // si tienes assets

app.get("/", (_req, _res) => {
  const data = {
    port: PORT,
    message: "Welcome to the Express server",
  };
  return _res.render("index", data); // renderiza views/index.ejs
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
