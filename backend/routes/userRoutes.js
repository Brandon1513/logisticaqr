const express = require("express");
const { check } = require("express-validator");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateProfile,
  logoutUser,
  getAllUsers,
} = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin"); // Asegúrate de que esto esté definido
const User = require("../models/User");

const router = express.Router();

// Ruta para registrar usuario (solo administradores)
router.post(
  "/register",
  auth,
  isAdmin,
  [
    check("username").not().isEmpty().withMessage("El nombre de usuario es requerido"),
    check("email").isEmail().withMessage("Correo válido es requerido"),
    check("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    check("rol").not().isEmpty().withMessage("El rol es requerido"),
    check("departamento").not().isEmpty().withMessage("El departamento es requerido"),
  ],
  registerUser
);

// Ruta para login de usuario (no protegida)
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Correo válido es requerido"),
    check("password").exists().withMessage("La contraseña es requerida"),
  ],
  loginUser
);

// Ruta para obtener perfil del usuario (protegido)
router.get("/profile", auth, getUserProfile);

// Ruta para actualizar perfil del usuario (protegido)
router.put("/update-profile", auth, updateProfile);

// Ruta para logout (no protegida)
router.post("/logout", auth, logoutUser);

// Ruta para obtener todos los usuarios
router.get("/dataUser", getAllUsers);

module.exports = router;
