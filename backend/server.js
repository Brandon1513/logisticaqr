require("dotenv").config({ path: "variables.env" });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a la base de datos
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Rutas
app.use("/api/users", userRoutes);

// Iniciar el servidor
app.listen(PORT, () => console.log(`Servidor ejecutándose en el puerto ${PORT}`));
