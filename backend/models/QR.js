const mongoose = require("mongoose");

const qrSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  noSerie: { type: String, required: true },
  proveedor: { type: String, required: true },
  estado: { type: String, default: "Activo" },
  referencia: { type: String, default: "Dasavena2024" },
  tipo: { type: String, required: true },
  ubicacion: { type: String, required: true },
  propietario: String,
  ubicacionProd: String,
  ubicacionAlma: String,
  ubicacionSanita: String,
  ubicacionOfi: String,
});

const QRModel = mongoose.model("Activos", qrSchema);

module.exports = QRModel;
