const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === 'Administrador') {
    return next(); // El usuario es un administrador, continuar
  }
  return res.status(403).json({ message: "Acceso denegado. No es un administrador." });
};

module.exports = isAdmin;
