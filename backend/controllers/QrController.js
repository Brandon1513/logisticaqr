const QRModel = require("../models/QR");

const saveQR = async (req, res) => {
  try {
    // Eliminar campos vacíos del cuerpo de la solicitud
    const filteredData = {};
    Object.keys(req.body).forEach(key => {
      if (req.body[key] && req.body[key].trim() !== "") {
        filteredData[key] = req.body[key].trim();
      }
    });

    // Crear una nueva instancia con los datos filtrados
    const qrData = new QRModel(filteredData);

    // Guardar en la base de datos
    await qrData.save();
    res.status(200).send("Datos guardados correctamente.");
  } catch (error) {
    res.status(500).send("Error al guardar los datos: " + error.message);
  }
};

module.exports = {
  saveQR,
};
