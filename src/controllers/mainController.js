const home = (req, res) => {
  const data = {
    port: process.env.PORT || 3000,
    message: "Welcome to the Express server",
  };
  res.render("index", data);
};

const getUserById = (req, res) => {
  const userId = req.params.id;
  res.send("Mostrar información del usuario con ID: " + userId);
};

const search = (req, res) => {
  const tipo = req.query.tipo || "No especificada";
  const orden = req.query.orden || 1;
  res.send(`Búsqueda: ${tipo}, Orden: ${orden}`);
};

const handleForm = (req, res) => {
  const formData = req.body || "No data received";

  console.log("Nombre", formData.Nombre);
  console.log("Email", formData.Email);
  res.json({ message: "Datos recibidos correctamente", data: formData });
};

module.exports = {
  home,
  getUserById,
  search,
  handleForm,
};
