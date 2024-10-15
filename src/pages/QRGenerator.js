import React, { useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import "../assets/styles/QRGenerator.css";
import {
  ubicaciones,
  produccion,
  almacen,
  baños,
  oficinas,
  tipoMap,
  ubicacionesMap,
  produccionMap,
  almacenMap,
  sanitariosMap,
  oficinasMap,
  tipoActivo,
} from "../assets/Ubicaciones";
import { API_BASE_URL } from "../config";

import QRIcon from "../assets/images/icons/QRIcon.gif"

function QRForm() {
  const [formData, setFormData] = useState({
    nombre: "",
    noSerie: "",
    proveedor: "",
    estado: "Activo",
    referencia: "Dasavena2024",
    tipo: "",
    ubicacion: "",
    propietario: "",
    ubicacionProd: "",
    ubicacionAlma: "",
    ubicacionSanita: "",
    ubicacionOfi: "",
  });
  const [qrData, setQrData] = useState("");
  const qrRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const qrString = `
      Nombre: ${formData.nombre}\n
      No. de Serie: ${formData.noSerie}\n
      Proveedor: ${formData.proveedor}\n
      Tipo: ${tipoMap[formData.tipo] || formData.tipo}\n
      ${
        formData.tipo === "equipo-computo"
          ? `Propietario: ${formData.propietario}\n`
          : ""
      }
      Ubicación: ${ubicacionesMap[formData.ubicacion] || formData.ubicacion}\n
      ${
        formData.ubicacion === "produccion"
          ? `Producción: ${
              produccionMap[formData.ubicacionProd] || formData.ubicacionProd
            }\n`
          : ""
      }
      ${
        formData.ubicacion === "almacen"
          ? `Almacén: ${
              almacenMap[formData.ubicacionAlma] || formData.ubicacionAlma
            }\n`
          : ""
      }
      ${
        formData.ubicacion === "sanitario"
          ? `Sanitario: ${
              sanitariosMap[formData.ubicacionSanita] ||
              formData.ubicacionSanita
            }\n`
          : ""
      }
      ${
        formData.ubicacion === "oficinas"
          ? `Oficina: ${
              oficinasMap[formData.ubicacionOfi] || formData.ubicacionOfi
            }\n`
          : ""
      }
    `;

    setQrData(qrString.trim());
    console.log(formData);
  };

  const token = localStorage.getItem("token");

  const handleSave = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/qr/save-qr`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          qrData,
        }),
      });

      if (response.ok) {
        alert("Datos guardados correctamente.");
      } else {
        alert("Error al guardar los datos.");
      }
    } catch (error) {
      console.error("Error al guardar los datos:", error);
    }
  };

  const handleClear = () => {
    setFormData({
      nombre: "",
      noSerie: "",
      proveedor: "",
      estado: "Activo",
      referencia: "Dasavena2024",
      tipo: "",
      ubicacion: "",
      propietario: "",
      ubicacionProd: "",
      ubicacionAlma: "",
      ubicacionSanita: "",
      ubicacionOfi: "",
    });
    setQrData("");
  };

  const handleExport = () => {
    const canvas = qrRef.current.querySelector("canvas");

    const exportCanvas = document.createElement("canvas");
    const ctx = exportCanvas.getContext("2d");

    const exportWidth = canvas.width + 10;
    const exportHeight = canvas.height + 120;
    exportCanvas.width = exportWidth;
    exportCanvas.height = exportHeight;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, exportWidth, exportHeight);

    ctx.fillStyle = "black";
    ctx.font = "bold 20px Arial";
    ctx.textAlign = "center";

    const title = "Dasavena";
    const reference = "Referencia";

    const titleYPosition = 30;
    const referenceYPosition = titleYPosition + 30;

    ctx.fillText(title, exportWidth / 2, titleYPosition);
    ctx.font = "20px Arial";
    ctx.fillText(reference, exportWidth / 2, referenceYPosition);

    const qrYPosition = referenceYPosition + 20;
    const qrXPosition = (exportWidth - canvas.width) / 2;
    ctx.drawImage(canvas, qrXPosition, qrYPosition);

    const exportPngUrl = exportCanvas.toDataURL("image/png");

    const downloadLink = document.createElement("a");
    downloadLink.href = exportPngUrl;
    downloadLink.download = `QR_${formData.nombre}_${formData.ubicacion}.png`;
    downloadLink.click();
  };

  return (
    <div className="form-container">
      <img src={QRIcon} className="QRIcon"/>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="noSerie">No. de Serie:</label>
          <input
            type="text"
            id="noSerie"
            name="noSerie"
            value={formData.noSerie}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="proveedor">Proveedor:</label>
          <input
            type="text"
            id="proveedor"
            name="proveedor"
            value={formData.proveedor}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="tipo">Tipo:</label>
          <select
            id="tipo"
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="">Selecciona el tipo</option>
            {tipoActivo.map((tipo) => (
              <option key={tipo.value} value={tipo.value}>
                {tipo.label}
              </option>
            ))}
          </select>
        </div>

        {(formData.tipo === "equipo-computo" ||
          formData.tipo === "transporte") && (
          <div className="input-group">
            <label htmlFor="propietario">Nombre del Propietario:</label>
            <input
              type="text"
              id="propietario"
              name="propietario"
              value={formData.propietario}
              onChange={handleChange}
              required={formData.tipo === "equipo-computo"}
            />
          </div>
        )}

        <div className="input-group">
          <label htmlFor="ubicacion">Ubicación:</label>
          <select
            id="ubicacion"
            name="ubicacion"
            value={formData.ubicacion}
            onChange={handleChange}
            required
          >
            <option>Selecciona la ubicación</option>
            {ubicaciones.map((ubicacion) => (
              <option key={ubicacion.value} value={ubicacion.value}>
                {ubicacion.label}
              </option>
            ))}
          </select>
        </div>

        {formData.ubicacion === "produccion" && (
          <div className="input-group">
            <label htmlFor="ubicacionProd">Ubicación en Producción</label>
            <select
              id="ubicacionProd"
              name="ubicacionProd"
              value={formData.ubicacionProd}
              onChange={handleChange}
              required
            >
              <option></option>
              {produccion.map((ubicacionProd) => (
                <option key={ubicacionProd.value} value={ubicacionProd.value}>
                  {ubicacionProd.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.ubicacion === "almacen" && (
          <div className="input-group">
            <label htmlFor="ubicacionAlma">Ubicación en Almacén</label>
            <select
              id="ubicacionAlma"
              name="ubicacionAlma"
              value={formData.ubicacionAlma}
              onChange={handleChange}
              required
            >
              <option></option>
              {almacen.map((ubicacionAlma) => (
                <option key={ubicacionAlma.value} value={ubicacionAlma.value}>
                  {ubicacionAlma.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.ubicacion === "sanitario" && (
          <div className="input-group">
            <label htmlFor="ubicacionSanita">Ubicación del Sanitario</label>
            <select
              id="ubicacionSanita"
              name="ubicacionSanita"
              value={formData.ubicacionSanita}
              onChange={handleChange}
              required
            >
              <option></option>
              {baños.map((ubicacionSanita) => (
                <option
                  key={ubicacionSanita.value}
                  value={ubicacionSanita.value}
                >
                  {ubicacionSanita.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {formData.ubicacion === "oficinas" && (
          <div className="input-group">
            <label htmlFor="ubicacionOfi">Ubicación en Oficina</label>
            <select
              id="ubicacionOfi"
              name="ubicacionOfi"
              value={formData.ubicacionOfi}
              onChange={handleChange}
              required
            >
              <option></option>
              {oficinas.map((ubicacionOfi) => (
                <option key={ubicacionOfi.value} value={ubicacionOfi.value}>
                  {ubicacionOfi.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="button-group">
          <button type="submit" className="qr-button">
            Generar QR
          </button>

          <button type="button" className="clear-button" onClick={handleClear}>
            Limpiar Formulario
          </button>
        </div>
      </form>

      {qrData && (
        <div className="qr-code-container">
          <h3>Código QR generado:</h3>
          <div className="qr-code" ref={qrRef}>
            <QRCodeCanvas value={qrData} size={256} />
          </div>

          <div className="qr-data-summary">
            <h4>Resumen de Datos:</h4>
            <p>
              <strong>Nombre:</strong> {formData.nombre}
            </p>
            <p>
              <strong>No. de Serie:</strong> {formData.noSerie}
            </p>
            <p>
              <strong>Proveedor:</strong> {formData.proveedor}
            </p>
            <p>
              <strong>Tipo:</strong> {tipoMap[formData.tipo] || formData.tipo}
            </p>
            <p>
              <strong>Ubicación:</strong>{" "}
              {ubicacionesMap[formData.ubicacion] || formData.ubicacion}
            </p>

            {formData.tipo === "equipo-computo" && (
              <p>
                <strong>Propietario:</strong> {formData.propietario}
              </p>
            )}

            {formData.ubicacion === "produccion" && (
              <p>
                <strong>Ubicación en Producción:</strong>{" "}
                {produccionMap[formData.ubicacionProd] ||
                  formData.ubicacionProd}
              </p>
            )}

            {formData.ubicacion === "almacen" && (
              <p>
                <strong>Ubicación en Almacén:</strong>{" "}
                {almacenMap[formData.ubicacionAlma] || formData.ubicacionAlma}
              </p>
            )}

            {formData.ubicacion === "sanitario" && (
              <p>
                <strong>Ubicación del Sanitario:</strong>{" "}
                {sanitariosMap[formData.ubicacionSanita] ||
                  formData.ubicacionSanita}
              </p>
            )}

            {formData.ubicacion === "oficinas" && (
              <p>
                <strong>Ubicación Oficina:</strong>{" "}
                {oficinasMap[formData.ubicacionOfi] || formData.ubicacionOfi}
              </p>
            )}
          </div>

          <div className="save-group">
            <button className="export-button" onClick={handleExport}>
              Exportar QR como PNG
            </button>

            <button type="button" className="save-button" onClick={handleSave}>
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QRForm;
