require("dotenv").config({ path: ".env" });
const os = require("os");
const app = require("./app");

const PORT = process.env.PORT || 3000;

// Obtener IP de red
function getLocalNetworkIP() {
  const interfaces = os.networkInterfaces();

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Solo IPv4 y no interna
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "No disponible";
}

const networkIP = getLocalNetworkIP();

app.listen(PORT, () => {
  console.log("==========================================");
  console.log("🚀 Servidor iniciado correctamente");
  console.log("==========================================");
  console.log(`🌐 Modo: ${process.env.NODE_ENV || "development"}`);
  console.log(`📅 Fecha: ${new Date().toLocaleString()}`);
  console.log("------------------------------------------");
  console.log(`🔌 Servidor escuchando en:`);
  console.log(`➡ Local:     http://localhost:${PORT}`);
  console.log(`➡ En red:    http://${networkIP}:${PORT}`);
  console.log("------------------------------------------");
  console.log("✔ Presiona CTRL + C para detener\n");
});
