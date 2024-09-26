const express = require("express");
const { check } = require("express-validator");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  logoutUser, // Asegúrate de tener este controlador en tu userController
} = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const router = express.Router();

// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
  if (req.user && req.user.rol === "Administrador") {
    return next(); // Usuario es administrador, continuar
  }
  return res
    .status(403)
    .json({ message: "Acceso denegado, se requiere rol de administrador." });
};

// Ruta para registrar usuario (solo administradores)
router.post(
  "/register",
  auth, // Protegiendo la ruta
  isAdmin,
  [
    check("username")
      .not()
      .isEmpty()
      .withMessage("El nombre de usuario es requerido"),
    check("email").isEmail().withMessage("Correo válido es requerido"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe tener al menos 6 caracteres"),
    check("rol").not().isEmpty().withMessage("El rol es requerido"),
    check("departamento")
      .not()
      .isEmpty()
      .withMessage("El departamento es requerido"),
  ],
  registerUser
);

// Obtener datos de todos los usuarios para el Datatable 
router.get("/dataUser", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
});

// Eliminar Usuario por ID (protegido)
router.delete("/:id", auth, isAdmin, async (req, res) => {
  // Solo administradores
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
});

// Ruta para actualizar el usuario (protegido)
router.put("/:id", auth, isAdmin, async (req, res) => {
  // Solo administradores
  try {
    const { id } = req.params;
    const { username, email, password, rol, departamento } = req.body;
    const updateFields = { username, email, rol, departamento };

    if (password) {
      // Hashear la contraseña antes de actualizar
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword; // Usar la contraseña hasheada
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      message: "Usuario actualizado exitosamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
});

// Ruta para login de usuario (no protegida)
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Correo válido es requerido"),
    check("password").exists().withMessage("La contraseña es requerida"),
  ],
  loginUser
);

// Ruta para logout (no protegida)
router.post("/logout", auth, logoutUser); // Asegúrate de que este controlador está definido en tu userController

// Ruta para obtener perfil del usuario (protegido)
router.get("/profile", auth, getUserProfile);

// Ruta para actualizar perfil del usuario (protegido)
router.put("/profile", auth, updateUserProfile);

module.exports = router;
