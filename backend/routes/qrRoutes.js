const express = require("express");
const { saveQR } = require("../controllers/QrController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Ruta para guardar el QR (protegida por autenticación)
router.post("/save-qr", auth, saveQR);

module.exports = router;
