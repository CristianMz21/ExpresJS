// Códigos ANSI para colores (sin dependencias externas)
const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  gray: "\x1b[90m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
  redBold: "\x1b[1m\x1b[31m",
  greenBold: "\x1b[1m\x1b[32m",
  yellowBold: "\x1b[1m\x1b[33m",
  cyanBold: "\x1b[1m\x1b[36m",
  whiteBold: "\x1b[1m\x1b[37m",
};

/**
 * Aplica color a un texto
 * @param {string} text - Texto a colorear
 * @param {string} color - Color ANSI
 * @returns {string} Texto con color
 */
const colorize = (text, color) => `${color}${text}${colors.reset}`;

/**
 * Obtiene el color según el método HTTP
 * @param {string} method - Método HTTP
 * @returns {string} Color ANSI
 */
const getMethodColor = (method) => {
  const methodColors = {
    GET: colors.green,
    POST: colors.blue,
    PUT: colors.yellow,
    PATCH: colors.cyan,
    DELETE: colors.red,
    OPTIONS: colors.gray,
    HEAD: colors.magenta,
  };
  return methodColors[method] || colors.white;
};

/**
 * Obtiene el color según el código de estado HTTP
 * @param {number} statusCode - Código de estado HTTP
 * @returns {string} Color ANSI
 */
const getStatusColor = (statusCode) => {
  if (statusCode >= 500) return colors.redBold;
  if (statusCode >= 400) return colors.yellowBold;
  if (statusCode >= 300) return colors.cyanBold;
  if (statusCode >= 200) return colors.greenBold;
  return colors.white;
};

/**
 * Formatea la duración con color según el tiempo
 * @param {number} duration - Duración en ms
 * @returns {string} Duración formateada con color
 */
const formatDuration = (duration) => {
  const text = `${duration}ms`;
  if (duration < 100) return colorize(text, colors.green);
  if (duration < 500) return colorize(text, colors.yellow);
  if (duration < 1000) return colorize(text, colors.magenta);
  return colorize(text, colors.red);
};

/**
 * Middleware de logging personalizado con colores
 */
const LoggerMiddleware = (req, res, next) => {
  const timestamp = new Date().toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const start = Date.now();
  const methodColor = getMethodColor(req.method);

  // Información de la petición
  const ip = req.ip || req.connection.remoteAddress || "unknown";
  const userAgent = req.get("user-agent") || "unknown";
  const contentType = req.get("content-type") || "none";

  // Log de entrada
  console.log(
    colorize(`[${timestamp}]`, colors.gray),
    colorize(req.method.padEnd(7), methodColor),
    colorize(req.url, colors.whiteBold),
    colorize(`| IP: ${ip}`, colors.gray)
  );

  // Log adicional para peticiones con body (POST, PUT, PATCH)
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    if (Object.keys(req.query).length > 0) {
      console.log(
        colorize("  ├─ Query:", colors.gray),
        colorize(JSON.stringify(req.query), colors.cyan)
      );
    }
    if (req.body && Object.keys(req.body).length > 0) {
      console.log(
        colorize("  ├─ Body:", colors.gray),
        colorize(JSON.stringify(req.body), colors.cyan)
      );
    }
    console.log(
      colorize("  ├─ Content-Type:", colors.gray),
      colorize(contentType, colors.cyan)
    );
  }

  // Log de salida cuando la respuesta termina
  res.on("finish", () => {
    const duration = Date.now() - start;
    const statusColor = getStatusColor(res.statusCode);
    const durationFormatted = formatDuration(duration);

    console.log(
      colorize(`[${timestamp}]`, colors.gray),
      colorize(req.method.padEnd(7), methodColor),
      colorize(req.url, colors.white),
      colorize("→", colors.gray),
      colorize(res.statusCode.toString(), statusColor),
      durationFormatted
    );

    // Línea separadora para mejor legibilidad en errores
    if (res.statusCode >= 400) {
      console.log(colorize("  └─" + "─".repeat(60), colors.gray));
    }
  });

  next();
};

module.exports = LoggerMiddleware;
