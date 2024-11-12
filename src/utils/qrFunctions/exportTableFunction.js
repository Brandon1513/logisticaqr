import * as XLSX from "xlsx";
import { tipoMap, ubicacionesMap } from "../../assets/Ubicaciones";
import jsPDF from "jspdf";
import "jspdf-autotable";

export const exportToExcel = (filteredData) => {
  const headers = [
    "Nombre",
    "No. de Serie",
    "Proveedor",
    "Tipo",
    "Ubicación",
    "Estado",
  ];
  const rows = filteredData.map((item) => [
    item.nombre,
    item.noSerie,
    item.proveedor,
    tipoMap[item.tipo] || item.tipo,
    ubicacionesMap[item.ubicacion] || item.ubicacion,
    item.estado,
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Activos Filtrados");

  XLSX.writeFile(workbook, "activos_filtrados.xlsx");
};

export const exportToPDF = (filteredData) => {
  const doc = new jsPDF();

  const tableColumn = [
    "Nombre",
    "No. de Serie",
    "Proveedor",
    "Tipo",
    "Ubicación",
    "Estado",
  ];
  const tableRows = [];

  filteredData.forEach((item) => {
    const rowData = [
      item.nombre,
      item.noSerie,
      item.proveedor,
      tipoMap[item.tipo] || item.tipo,
      ubicacionesMap[item.ubicacion] || item.ubicacion,
      item.estado,
    ];
    tableRows.push(rowData);
  });

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
  });

  doc.save("activos_filtrados.pdf");
};
