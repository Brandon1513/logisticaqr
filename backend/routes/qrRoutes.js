const express = require("express");
const { saveQR, getQrData, deleteQR, updateQR } = require("../controllers/QrController");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Ruta para guardar el QR (protegida por autenticación)
router.post("/save-qr", auth, saveQR);

router.get("/qr-data", getQrData);

// Ruta para eliminar un QR por su ID (protegida por autenticación)
router.delete("/delete/:id", auth, deleteQR);

// Ruta para actualizar un QR por su ID (protegida por autenticación)
router.put("/update/:id", auth, updateQR);

module.exports = router;
