import 'jspdf-autotable';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

export function exportToExcel(data, filename) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Storage Areas');
  XLSX.writeFile(workbook, `${filename}.xlsx`);
}

export function exportToCSV(data, filename) {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const csv = XLSX.utils.sheet_to_csv(worksheet);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${filename}.csv`;
  link.click();
}

export function exportToPDF(data, filename) {
  const doc = new jsPDF();
  doc.autoTable({
    head: [Object.keys(data[0])],
    body: data.map(Object.values),
  });
  doc.save(`${filename}.pdf`);
}
