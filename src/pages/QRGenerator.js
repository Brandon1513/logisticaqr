import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react'; 
import '../assets/styles/QRGenerator.css'; 

function QRForm() {
    const [formData, setFormData] = useState({
        nombre: '',
        noSerie: '',
        tipo: '',
        ubicacion: '',
        propietario: ''
    });
    const [qrData, setQrData] = useState('');
    const qrRef = useRef(); // Usamos useRef para acceder al canvas del QR

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const qrString = `
            Nombre: ${formData.nombre}\n
            No. de Serie: ${formData.noSerie}\n
            Tipo: ${formData.tipo}\n
            Ubicación: ${formData.ubicacion}\n
            ${formData.tipo === 'equipo-computo' ? `Propietario: ${formData.propietario}\n` : ''}
        `;

        setQrData(qrString.trim());
        console.log(formData);
    };

    const handleClear = () => {
        setFormData({
            nombre: '',
            noSerie: '',
            tipo: '',
            ubicacion: '',
            propietario: ''
        });
        setQrData('');
    };

    const handleExport = () => {
        const canvas = qrRef.current.querySelector('canvas'); 
        const pngUrl = canvas.toDataURL('image/png'); 
        const downloadLink = document.createElement('a'); 
        downloadLink.href = pngUrl;
        downloadLink.download = `codigoQR_${formData.nombre || 'qr'}.png`; 
        downloadLink.click(); 
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

                {formData.tipo === 'equipo-computo' && (
                    <div className="input-group">
                        <label htmlFor="propietario">Nombre del Propietario:</label>
                        <input
                            type="text"
                            id="propietario"
                            name="propietario"
                            value={formData.propietario}
                            onChange={handleChange}
                            required={formData.tipo === 'equipo-computo'}
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
                        <option value="">Selecciona la ubicación</option>
                        <option value="almacen-mp">Almacén MP</option>
                        <option value="almacen-pt">Almacén PT</option>
                        <option value="produccion">Producción</option>
                        <option value="oficinas">Oficinas</option>
                    </select>
                </div>
                <div className="button-group">
                    <button type="submit" className="submit-button">Generar QR</button>
                    <button type="button" className="clear-button" onClick={handleClear}>Limpiar Formulario</button>
                </div>
            </form>

            {qrData && (
                <div className="qr-code-container">
                    <h3>Código QR generado:</h3>
                    <div ref={qrRef}> 
                        <QRCodeCanvas value={qrData} size={256} />
                    </div>
                    <pre>{qrData}</pre>
                    
                    <button className="export-button" onClick={handleExport}>Exportar QR como PNG</button>
                </div>
            )}
        </div>
    );
}

export default QRForm;
