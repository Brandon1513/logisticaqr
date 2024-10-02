require("dotenv").config({ path: ".env" });
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const bodyParser = require("body-parser");
const qrRoutes = require('./routes/qrRoutes')

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar a la base de datos
connectDB();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Ruta User
app.use("/user", require("./routes/userRoutes"));
// Ruta QR
app.use("/qr", qrRoutes)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
