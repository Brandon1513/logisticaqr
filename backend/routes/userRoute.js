const express = require("express");
const { check } = require("express-validator");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/userController");
const auth = require("../middleware/auth");

const router = express.Router();

// Ruta para registrar usuario
router.post(
  "/register",
  [
    check("username").not().isEmpty().withMessage("El nombre de usuario es requerido"),
    check("email").isEmail().withMessage("Correo válido es requerido"),
    check("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    check("rol").not().isEmpty().withMessage("El rol es requerido"),
    check("departamento").not().isEmpty().withMessage("El departamento es requerido"),
  ],
  registerUser
);

// Ruta para login de usuario
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Correo válido es requerido"),
    check("password").exists().withMessage("La contraseña es requerida"),
  ],
  loginUser
);

// Ruta para obtener perfil del usuario (protección con auth)
router.get("/profile", auth, getUserProfile);

module.exports = router;
