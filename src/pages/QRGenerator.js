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
import DasavenaLogo from "../assets/images/DasavenaLogo.png";
import QRIcon from "../assets/images/icons/QRIcon.gif";
import { generateQrString, downloadQR } from "../utils/qrFunctions/exportQrFunction";
import { saveQRData } from "../utils/qrFunctions/qrUtils";

function QRForm() {
  const [qrData, setQrData] = useState("");
  const qrRef = useRef();
  const token = localStorage.getItem("token");

  //Generación del objeto local del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    noSerie: "",
    proveedor: "",
    estado: "Activo",
    referencia: "F-ADM-01",
    tipo: "",
    ubicacion: "",
    propietario: "",
    ubicacionProd: "",
    ubicacionAlma: "",
    ubicacionSanita: "",
    ubicacionOfi: "",
  });
  
  //Función que controla los cambios del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //Genera el codigo Qr una vez que llenemos el formulario
  const handleGenerateQr = (e) => {
    e.preventDefault();
    const qrContent = generateQrString(formData);
    setQrData(qrContent);
  }

  //Guardar el formulario dentro de la base de datos
  const handleSaveQr = () => {
    saveQRData(formData, qrData, token);
  }

  //Descarga el QR con el diseño
  const handleDownloadQr = (qrRef, modalData) => {
    if (qrRef.current) {
      downloadQR(qrRef, modalData);
    } else {
      console.error("El QR no está disponible para descargar");
    }
  };

  //Limpiar campos del formulario
  const handleClear = () => {
    setFormData({
      nombre: "",
      noSerie: "",
      proveedor: "",
      estado: "Activo",
      referencia: "F-ADM-01",
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

  return (
    <div className="form-container">
      <img src={QRIcon} className="QRIcon" />
      <form onSubmit={handleGenerateQr}>
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
            <QRCodeCanvas
              value={qrData}
              size={256}
              level="Q"
              marginSize={0}
              imageSettings={{
                src: DasavenaLogo,
                x: undefined,
                y: undefined,
                height: 150,
                width: 150,
                opacity: 1,
                excavate: false,
              }}
            />
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
            <button className="export-button-form" onClick={() => handleDownloadQr(qrRef,formData)}>
              Exportar QR como PNG
            </button>

            <button type="button" className="save-button" onClick={handleSaveQr}>
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default QRForm;
