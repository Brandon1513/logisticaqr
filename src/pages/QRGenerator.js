import React, { useState } from 'react';
import '../assets/styles/QRGenerator.css'; 

function QRForm() {
    const [formData, setFormData] = useState({
        nombre: '',
        noSerie: '',
        tipo: '',
        ubicacion: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
        
    };

    return (
        <div className="form-container">
            <h2>Generar Código QR</h2>
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
                    <label htmlFor="tipo">Tipo:</label>
                    <select
                        id="tipo"
                        name="tipo"
                        value={formData.tipo}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona el tipo</option>
                        <option value="equipo-computo">Equipo de Cómputo</option>
                        <option value="electrodomestico">Electrodoméstico</option>
                        <option value="muebles">Muebles</option>
                        <option value="maquinaria">Maquinaria</option>
                        <option value="herramienta">Herramienta</option>
                    </select>
                </div>
                <div className="input-group">
                    <label htmlFor="ubicacion">Ubicación:</label>
                    <select
                        id="ubicacion"
                        name="ubicacion"
                        value={formData.ubicacion}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona la ubicación</option>
                        <option value="almacen-mp">Almacén MP</option>
                        <option value="almacen-pt">Almacén PT</option>
                        <option value="produccion">Producción</option>
                        <option value="oficinas">Oficinas</option>
                    </select>
                </div>
                <button type="submit" className="submit-button">Generar QR</button>
            </form>
        </div>
    );
}

export default QRForm;
