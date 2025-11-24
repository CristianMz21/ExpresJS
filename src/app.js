require("dotenv").config({ path: "/home/mackroph/Platzi/Expres/.env" });

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("src/public"));

app.get("/", (_req, _res) => {
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
