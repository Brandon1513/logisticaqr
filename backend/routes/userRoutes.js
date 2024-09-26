const express = require("express");
const { check } = require("express-validator");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");
const auth = require("../middleware/auth");
const User = require("../models/User");

const router = express.Router();

// Ruta para registrar usuario
router.post(
  "/register",
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

//Obtener datos de todos los usuarios para el Datatable
router.get("/dataUser", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los usuarios" });
  }
});

//Eliminar Usuario por ID
router.delete("/:id", async (req, res) => {
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

//Ruta para actulizar el usuario
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, rol, departamento } = req.body;
    const updateFields = { username, email, rol, departamento };

    if (password) {
      updateFields.password = password;
    }
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario actualizado exitosamente", user: updatedUser });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
});



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

// Ruta para actualizar perfil del usuario (protección con auth)
router.put("/profile", auth, updateUserProfile);

module.exports = router;
