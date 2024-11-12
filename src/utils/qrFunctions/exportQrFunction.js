import {
  tipoMap,
  ubicacionesMap,
  produccionMap,
  almacenMap,
  sanitariosMap,
  oficinasMap,
} from "../../assets/Ubicaciones";

export const generateQrString = (qrData, e) => {
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
          sanitariosMap[qrData.ubicacionSanita] ||
          qrData.ubicacionSanita.toString()
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
  const exportWidth = canvas.width + 20; // Mantener el mismo ancho que el QR
  const exportHeight = canvas.height + 100; // Ajustar la altura para el título y referencia
  exportCanvas.width = exportWidth;
  exportCanvas.height = exportHeight;

  // Fondo blanco
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, exportWidth, exportHeight);

  // Texto del título en la parte superior
  const title = "Dasavena";
  ctx.fillStyle = "black";
  ctx.font = "bold 30px Arial"; // Título con 30px
  ctx.textAlign = "center"; // Alineación centrada
  ctx.fillText(title, exportWidth / 2, 40); // Posiciona el título en el centro arriba

  // Posicionar el QR debajo del título
  const qrYPosition = 50; // Ajuste superior para el QR (debajo del título)
  const qrXPosition = (exportWidth - canvas.width) / 2; // Centrar el QR horizontalmente
  ctx.drawImage(canvas, qrXPosition, qrYPosition);

  // Texto de la referencia en la parte inferior
  const reference = "F-ADM-01";
  ctx.font = "20px Arial"; // Referencia con 20px
  ctx.fillText(reference, exportWidth / 2, exportHeight - 20); // Posiciona la referencia en el centro abajo

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
