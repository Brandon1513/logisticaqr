require("dotenv").config({ path: ".env" });
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: "DasavenaBD",
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Definir modelos de usuario
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", UserSchema);

// Rutas de autenticación
app.post(
  "/register",
  [
    check("username").not().isEmpty().withMessage("El usuario es requerido"),
    check("email").isEmail().withMessage("Valid email is required"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("La contraseña debe ser de almenos 6 caracteres"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();
      res.send("Usuario registrado correctamente");
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

app.post(
  "/login",
  [
    check("email").isEmail().withMessage("Valid email is required"),
    check("password").exists().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Incorrect password" });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

// Ruta para obtener el perfil del usuario
app.get("/profile", async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

// Ruta para actualizar el perfil del usuario
app.put(
  "/profile",
  [
    check("username")
      .optional()
      .not()
      .isEmpty()
      .withMessage("El nombre de usuario es requerido"),
    check("email").optional().isEmail().withMessage("Inserte un Correo valido"),
    check("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("La contraseña debe contener al menos 6 caracteres"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ message: "No token, Acceso Denegado" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const { username, email, password } = req.body;
      const updates = {};

      if (username) updates.username = username;
      if (email) updates.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        updates.password = hashedPassword;
      }

      const user = await User.findByIdAndUpdate(decoded.id, updates, {
        new: true,
      }).select("-password");
      res.json(user);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

//Guardado de datos
const TemperatureSchema = new mongoose.Schema({
  temperatura: { type: Number, required: true },
  timestamp: { type: Date, required: true },
});

const Temperature = mongoose.model("Temperature", TemperatureSchema);

// Ruta para guardar datos de temperatura
app.post("/save-temperature", async (req, res) => {
  const { temperatura } = req.body;

  // Validación simple
  if (typeof temperatura !== "number") {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    const temperature = new Temperature({
      temperatura,
      timestamp: new Date(),
    });
    await temperature.save();
    res.status(200).json({ message: "Temperature data saved successfully" });
  } catch (error) {
    console.error("Error saving temperature:", error);
    res.status(500).send("Server error");
  }
});


//mostrar los datos
// Ruta para obtener datos de temperatura
app.get("/temperatures", async (req, res) => {
  try {
    const temperatures = await Temperature.find().sort({ timestamp: -1 });
    res.json(temperatures);
  } catch (error) {
    console.error("Error fetching temperatures:", error);
    res.status(500).send("Server error");
  }
});

// Ruta para obtener el último dato de temperatura
app.get("/ultimo-valor", async (req, res) => {
  try {
    const lastTemperature = await Temperature.findOne().sort({ timestamp: -1 });
    if (!lastTemperature) {
      return res.status(404).json({ message: "No temperature data found" });
    }
    res.json(lastTemperature);
  } catch (error) {
    console.error("Error fetching last temperature:", error);
    res.status(500).send("Server error");
  }
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

