import React, { useState, useEffect, useMemo } from "react";
import {
  ubicaciones,
  produccion,
  almacen,
  baños,
  oficinas,
  tipoActivo,
} from "../assets/Ubicaciones";
import { useLocation, useNavigate } from "react-router-dom";
import { updateQrData } from "../utils/qrFunctions/qrUtils";

const EditQrForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  const [rol, setRole] = useState(null);
  const token = localStorage.getItem("token");

  //Busca el rol del usuario guardado en las sesión
  useEffect(() => {
    const currentState = location.state;
    if (currentState && currentState.rol) {
      setRole(currentState.rol);
    } else {
      const storedRole = localStorage.getItem("rol");
      setRole(storedRole);
    }
  }, [location]);

  const initialData = useMemo(() => {
    return location.state?.activo || {};
  }, [location.state?.activo]);

  //Incializa el formulario con la información del activo seleccionado
  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  //Maneja los cambios realizados en el formulario para despues ser enviado
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //Guarda los cambios realizados en el formulario
  const handleUpdateQR = async (e) => {
    e.preventDefault();
    await updateQrData(formData, token, navigate);
  };

  return (
    <div className="form-container">
      <h2>Editar Activo</h2>
      <form onSubmit={handleUpdateQR}>
        <div className="input-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
            readOnly={rol !== "Administrador"}
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
            readOnly={rol !== "Administrador"}
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
            readOnly={rol !== "Administrador"}
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
            <option value="Desecho">Desecho</option>
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
            disabled={rol !== "Administrador"}
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
              readOnly={rol !== "Administrador"}
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
            disabled={rol !== "Administrador"}
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
              disabled={rol !== "Administrador"}
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
              disabled={rol !== "Administrador"}
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
              disabled={rol !== "Administrador"}
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
              disabled={rol !== "Administrador"}
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
