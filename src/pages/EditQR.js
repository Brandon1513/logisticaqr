import React, { useState, useEffect } from "react";
import {
  ubicaciones,
  produccion,
  almacen,
  baños,
  oficinas,
  tipoActivo,
} from "../assets/Ubicaciones";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const EditQrForm = () => {
  const location = useLocation();
  const initialData = location.state?.activo || {}; // Cargar datos del activo o inicializar vacío
  const [formData, setFormData] = useState(initialData);
  const navigate = useNavigate();

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const token = localStorage.getItem("token");
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${API_BASE_URL}/qr/update/${formData._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Error actualizando el QR");
      }

      alert("QR actualizado correctamente");
      navigate("/datatable");
    } catch (error) {
      console.error("Error:", error);
      alert("Error actualizando el QR");
    }
  };

  return (
    <div className="form-container">
      <h2>Editar Activo</h2>
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
          <label htmlFor="estado">Estado:</label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
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

        <button className="save-button" type="submit">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditQrForm;
