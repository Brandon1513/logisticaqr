const express = require("express");
const { saveQR, getQrData } = require("../controllers/QrController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Ruta para guardar el QR (protegida por autenticación)
router.post("/save-qr", auth, saveQR);

router.get("/qr-data", getQrData);

module.exports = router;
