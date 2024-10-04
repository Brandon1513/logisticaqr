const QRModel = require("../models/QR");

exports.saveQR = async (req, res) => {
  try {
    // Eliminar campos vacíos del cuerpo de la solicitud
    const filteredData = {};
    Object.keys(req.body).forEach((key) => {
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

exports.getQrData = async (req, res) => {
  try {
    const qrDataList = await QRModel.find();
    res.json(qrDataList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Eliminar un QR por su ID
exports.deleteQR = async (req, res) => {
  try {
    const { id } = req.params; // Obtener el ID desde los parámetros de la URL

    const result = await QRModel.findByIdAndDelete(id); // Buscar y eliminar el documento

    if (!result) {
      return res.status(404).json({ message: "QR no encontrado" });
    }

    res.status(200).json({ message: "QR eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el QR", error });
  }
};
