const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Obtener el token del encabezado de autorización
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "No se ha proporcionado un token." });
  }

  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: "Token no válido." });
  }
};

module.exports = authMiddleware;
