const { catchAsync, ValidationError } = require("../utils/errorHelpers");

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

const search = catchAsync(async (req, res) => {
  const tipo = req.query.tipo || "No especificada";
  const orden = req.query.orden || 1;

  res.status(200).json({
    status: "success",
    data: {
      tipo,
      orden,
      message: `Búsqueda: ${tipo}, Orden: ${orden}`,
    },
  });
});

const handleForm = catchAsync(async (req, res) => {
  const formData = req.body;

  // Validar que se recibieron datos
  if (!formData || Object.keys(formData).length === 0) {
    throw new ValidationError("No se recibieron datos del formulario");
  }

  // Validar campos requeridos
  const { Nombre, Email } = formData;
  const errors = [];

  if (!Nombre || Nombre.trim() === "") {
    errors.push("El campo 'Nombre' es requerido");
  }

  if (!Email || Email.trim() === "") {
    errors.push("El campo 'Email' es requerido");
  }

  if (errors.length > 0) {
    throw new ValidationError("Errores en el formulario", errors);
  }

  console.log("Nombre:", Nombre);
  console.log("Email:", Email);

  res.status(200).json({
    status: "success",
    message: "Datos recibidos correctamente",
    data: formData,
  });
});

module.exports = {
  home,
  getUserById,
  search,
  handleForm,
};
