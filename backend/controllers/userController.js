const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// Función auxiliar para hashear contraseñas
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Registrar usuario
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password, rol, departamento } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      rol,
      departamento,
    });

    await newUser.save();

    // Generar JWT
    const payload = { id: newUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ token, user: newUser }); // Incluir el nuevo usuario en la respuesta
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del servidor");
  }
};

// Login de usuario
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const payload = { id: user._id, rol: user.rol, username: user.username };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, rol: user.rol });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del servidor");
  }
};

// Obtener perfil del usuario
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error del servidor");
  }
};

// Actualizar perfil del usuario
exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  const { username, email, password, rol, departamento } = req.body;
  const updates = {};

  if (username) updates.username = username;
  if (email) updates.email = email;
  if (rol) updates.rol = rol;
  if (departamento) updates.departamento = departamento;

  // Si se proporciona una nueva contraseña, hashearla
  if (password) {
    updates.password = await hashPassword(password);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({
      message: "Perfil actualizado exitosamente",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    if (error.name === "ValidationError") {
      return res
        .status(400)
        .json({ message: "Error de validación", errors: error.errors });
    }
    res.status(500).json({ message: "Error al actualizar el perfil" });
  }
};

// Obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params; // Obtener el ID del usuario a actualizar
  const { username, email, password, rol, departamento } = req.body;

  try {
    // Buscar al usuario por ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar los campos del usuario
    user.username = username || user.username;
    user.email = email || user.email;
    user.rol = rol || user.rol;
    user.departamento = departamento || user.departamento;

    // Actualizar contraseña solo si se proporciona una nueva
    if (password) {
      user.password = password; // Asegúrate de tener hash para las contraseñas
    }

    // Guardar los cambios en la base de datos
    const updatedUser = await user.save();

    // Enviar respuesta de éxito
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    res.status(500).json({ message: "Error al actualizar el usuario" });
  }
};

// Eliminar usuario por ID
exports.deleteUser = async (req, res) => {
  const { id } = req.params; // Obtener el ID del usuario a eliminar

  try {
    // Usar findByIdAndDelete para eliminar directamente el usuario
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};



// Logout de usuario
exports.logoutUser = (req, res) => {
  // Aquí puedes invalidar el token en el cliente
  res.json({
    message: "Logout exitoso. El token debe ser eliminado en el cliente.",
  });
};
