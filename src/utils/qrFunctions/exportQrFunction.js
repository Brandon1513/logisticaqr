import {
  tipoMap,
  ubicacionesMap,
  produccionMap,
  almacenMap,
  sanitariosMap,
  oficinasMap,
} from "../../assets/Ubicaciones";

export const generateQrString = (qrData) => {
  const qrContent = [
    `Nombre - ${qrData.nombre.toString()}`,
    `No. de Serie - ${qrData.noSerie.toString()}`,
    `Proveedor - ${qrData.proveedor.toString()}`,
    `Tipo - ${tipoMap[qrData.tipo] || qrData.tipo.toString()}`,
    `Ubicación - ${
      ubicacionesMap[qrData.ubicacion] || qrData.ubicacion.toString()
    }`,
    qrData.propietario ? `Propietario - ${qrData.propietario.toString()}` : "",
    qrData.ubicacionProd
      ? `Producción - ${
          produccionMap[qrData.ubicacionProd] || qrData.ubicacionProd.toString()
        }`
      : "",
    qrData.ubicacionAlma
      ? `Almacén - ${
          almacenMap[qrData.ubicacionAlma] || qrData.ubicacionAlma.toString()
        }`
      : "",
    qrData.ubicacionSanita
      ? `Sanitario - ${
          sanitariosMap[qrData.ubicacionSanita] || qrData.ubicacionSanita.toString()
        }`
      : "",
    qrData.ubicacionOfi
      ? `Oficina - ${
          oficinasMap[qrData.ubicacionOfi] || qrData.ubicacionOfi.toString()
        }`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  return qrContent;
};


export const downloadQR = (qrRef, qrModalData) => {
    const canvas = qrRef.current.querySelector("canvas");

    // Crear un nuevo canvas para la exportación
    const exportCanvas = document.createElement("canvas");
    const ctx = exportCanvas.getContext("2d");

    // Definir dimensiones de exportación (añade espacio adicional para el texto)
    const exportWidth = canvas.width + 200; // Añade espacio para el texto a la derecha
    const exportHeight = canvas.height + 20; // Ajusta la altura del canvas según sea necesario
    exportCanvas.width = exportWidth;
    exportCanvas.height = exportHeight;

    // Fondo blanco
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, exportWidth, exportHeight);

    // Posicionar el QR a la izquierda
    const qrYPosition = 10; // Ajuste superior para el QR
    const qrXPosition = 10; // Deja un margen de 10px desde la izquierda
    ctx.drawImage(canvas, qrXPosition, qrYPosition);

    // Texto del título y referencia
    ctx.fillStyle = "black";
    ctx.font = "bold 30px Arial"; // Título con 30px
    ctx.textAlign = "left"; // Alineación a la izquierda

    const title = "Dasavena";
    const reference = "F-ADM-01";

    // Posiciona el texto a la derecha del QR
    const textXPosition = qrXPosition + canvas.width + 20; // 20px de separación del QR
    const titleYPosition = qrYPosition + 150; // Posición en línea con el QR
    const referenceYPosition = titleYPosition + 40; // Espacio para la referencia

    // Dibujar el título y la referencia
    ctx.fillText(title, textXPosition, titleYPosition);
    ctx.font = "20px Arial"; // Referencia con 20px
    ctx.fillText(reference, textXPosition, referenceYPosition);

    // Convertir el canvas a URL de imagen PNG
    const exportPngUrl = exportCanvas.toDataURL("image/png");

    // Crear enlace de descarga
    const downloadLink = document.createElement("a");
    downloadLink.href = exportPngUrl;
    downloadLink.download = `QR_${qrModalData.nombre}_${qrModalData.ubicacion}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
