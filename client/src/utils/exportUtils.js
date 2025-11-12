import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// Verificar que las librerías se cargaron correctamente
console.log('✅ Módulo exportUtils cargado');
console.log('✅ jsPDF disponible:', typeof jsPDF);
console.log('✅ autoTable disponible:', typeof autoTable);
console.log('✅ XLSX disponible:', typeof XLSX);

/**
 * Formatear fecha para mostrar
 */
const formatDate = (dateString) => {
  if (!dateString) return "No registrado";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
  } catch {
    return "Fecha inválida";
  }
};

/**
 * Exportar una cerda individual a PDF
 */
export const exportSowToPDF = (sow) => {
  try {
    console.log('Iniciando exportación PDF de cerda:', sow);
    
    // Obtener información del usuario
    let userName = 'Usuario';
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Usuario';
      }
    } catch (e) {
      console.log('No se pudo obtener el usuario:', e);
    }
    
    const doc = new jsPDF();
    
    // Configuración de colores
    const primaryColor = [219, 39, 119]; // Rosa
    
    // Encabezado mejorado
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('FICHA DE CERDA REPRODUCTORA', 105, 15, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont(undefined, 'normal');
    doc.text(`Arete: ${sow.ear_tag}`, 105, 25, { align: 'center' });
    
    // Información del reporte
    doc.setFontSize(9);
    const currentDate = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generado: ${currentDate} | Por: ${userName}`, 105, 35, { align: 'center' });
    
    // Agregar imagen si existe
    let yPosition = 50;
    if (sow.photo_url) {
      try {
        doc.addImage(sow.photo_url, 'JPEG', 75, yPosition, 60, 60);
        yPosition += 70;
      } catch (error) {
        console.log('No se pudo agregar la imagen:', error);
        yPosition += 10; // Espacio mínimo si no hay imagen
      }
    }
    
    // Resetear color de texto
    doc.setTextColor(0, 0, 0);
  
  // Sección 1: Identificación
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPosition, 190, 8, 'F');
  doc.setFontSize(12);
  doc.setFont(undefined, 'bold');
  doc.text('IDENTIFICACION', 15, yPosition + 6);
  yPosition += 12;
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Campo', 'Valor']],
    body: [
      ['Arete', sow.ear_tag || 'N/A'],
      ['Tipo de ID', sow.id_type || 'N/A'],
      ['Alias', sow.alias || 'Sin alias'],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    margin: { left: 15, right: 15 },
  });
  
  yPosition = doc.lastAutoTable.finalY + 10;
  
  // Sección 2: Genética
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPosition, 190, 8, 'F');
  doc.setFont(undefined, 'bold');
  doc.text('GENETICA', 15, yPosition + 6);
  yPosition += 12;
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Campo', 'Valor']],
    body: [
      ['Raza', sow.breed || 'N/A'],
      ['Línea Genética', sow.genetic_line || 'No especificada'],
      ['Generación', sow.generation || 'No especificada'],
      ['Arete del Padre', sow.sire_tag || 'No registrado'],
      ['Arete de la Madre', sow.dam_tag || 'No registrado'],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    margin: { left: 15, right: 15 },
  });
  
  yPosition = doc.lastAutoTable.finalY + 10;
  
  // Verificar si necesitamos una nueva página
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Sección 3: Fechas y Origen
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPosition, 190, 8, 'F');
  doc.setFont(undefined, 'bold');
  doc.text('FECHAS Y ORIGEN', 15, yPosition + 6);
  yPosition += 12;
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Campo', 'Valor']],
    body: [
      ['Fecha de Nacimiento', formatDate(sow.birth_date)],
      ['Fecha de Entrada', formatDate(sow.entry_date)],
      ['Origen', sow.origin || 'N/A'],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    margin: { left: 15, right: 15 },
  });
  
  yPosition = doc.lastAutoTable.finalY + 10;
  
  // Sección 4: Ubicación
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPosition, 190, 8, 'F');
  doc.setFont(undefined, 'bold');
  doc.text('UBICACION', 15, yPosition + 6);
  yPosition += 12;
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Campo', 'Valor']],
    body: [
      ['Granja', sow.farm_name || 'No especificada'],
      ['Ubicación/Galpón', sow.location || 'No especificada'],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    margin: { left: 15, right: 15 },
  });
  
  yPosition = doc.lastAutoTable.finalY + 10;
  
  // Sección 5: Estado
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPosition, 190, 8, 'F');
  doc.setFont(undefined, 'bold');
  doc.text('ESTADO', 15, yPosition + 6);
  yPosition += 12;
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Campo', 'Valor']],
    body: [
      ['Estado General', sow.status || 'N/A'],
      ['Estado Reproductivo', sow.reproductive_status || 'vacia'],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    margin: { left: 15, right: 15 },
  });
  
  yPosition = doc.lastAutoTable.finalY + 10;
  
  // Verificar si necesitamos una nueva página
  if (yPosition > 200) {
    doc.addPage();
    yPosition = 20;
  }
  
  // Sección 6: Datos Físicos
  doc.setFillColor(240, 240, 240);
  doc.rect(10, yPosition, 190, 8, 'F');
  doc.setFont(undefined, 'bold');
  doc.text('DATOS FISICOS', 15, yPosition + 6);
  yPosition += 12;
  
  autoTable(doc, {
    startY: yPosition,
    head: [['Campo', 'Valor']],
    body: [
      ['Peso Actual', `${sow.current_weight || 'N/A'} kg`],
      ['Peso Mínimo Servicio', `${sow.min_service_weight || 'No especificado'} kg`],
      ['Condición Corporal', sow.body_condition || 'N/A'],
      ['Fecha Último Pesaje', formatDate(sow.last_weight_date)],
    ],
    theme: 'striped',
    headStyles: { fillColor: primaryColor },
    margin: { left: 15, right: 15 },
  });
  
  // Pie de página mejorado
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    
    // Línea decorativa
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(15, 283, 195, 283);
    
    doc.setFontSize(8);
    doc.setTextColor(100, 100, 100);
    doc.setFont(undefined, 'normal');
    
    // Izquierda: Usuario
    doc.text(`Generado por: ${userName}`, 15, 288);
    
    // Centro: Fecha
    doc.text(
      `${new Date().toLocaleDateString('es-ES')}`,
      105,
      288,
      { align: 'center' }
    );
    
    // Derecha: Página
    doc.text(
      `Página ${i} de ${pageCount}`,
      195,
      288,
      { align: 'right' }
    );
  }
  
  // Guardar el PDF
  console.log('Guardando PDF...');
  doc.save(`Ficha_Cerda_${sow.ear_tag}_${new Date().toISOString().split('T')[0]}.pdf`);
  console.log('PDF guardado exitosamente');
  } catch (error) {
    console.error('Error al exportar PDF:', error);
    alert('Error al generar el PDF: ' + error.message);
  }
};

/**
 * Exportar todas las cerdas a PDF (formato tabla)
 */
export const exportAllSowsToPDF = (sows) => {
  try {
    console.log('Iniciando exportación PDF de todas las cerdas:', sows.length);
    
    // Obtener información del usuario
    let userName = 'Usuario';
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Usuario';
      }
    } catch (e) {
      console.log('No se pudo obtener el usuario:', e);
    }
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    const primaryColor = [219, 39, 119]; // Rosa
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Encabezado profesional
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Título principal
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('REGISTRO DE CERDAS REPRODUCTORAS', pageWidth / 2, 15, { align: 'center' });
    
    // Subtítulo
    doc.setFontSize(14);
    doc.setFont(undefined, 'normal');
    doc.text(`Total de registros: ${sows.length}`, pageWidth / 2, 25, { align: 'center' });
    
    // Información del reporte
    doc.setFontSize(10);
    const currentDate = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generado el: ${currentDate}`, pageWidth / 2, 32, { align: 'center' });
    doc.text(`Generado por: ${userName}`, pageWidth / 2, 37, { align: 'center' });
    
    // Preparar datos para la tabla con TODOS los campos
    const tableData = sows.map((sow, index) => [
      index + 1, // Número
      sow.ear_tag || 'N/A',
      sow.alias || '-',
      sow.breed || 'N/A',
      sow.genetic_line || '-',
      sow.generation || '-',
      sow.sire_tag || '-',
      sow.dam_tag || '-',
      formatDate(sow.birth_date),
      formatDate(sow.entry_date),
      sow.origin || '-',
      sow.farm_name || '-',
      sow.location || '-',
      sow.status || 'N/A',
      sow.reproductive_status || 'vacia',
      sow.current_weight || '-',
      sow.min_service_weight || '-',
      sow.body_condition || '-',
      formatDate(sow.last_weight_date),
      sow.parity_count || '0'
    ]);
    
    // Resetear color de texto
    doc.setTextColor(0, 0, 0);
    
    autoTable(doc, {
      startY: 45,
      head: [[
        '#',
        'Arete',
        'Alias',
        'Raza',
        'Línea Gen.',
        'Gen.',
        'Padre',
        'Madre',
        'F. Nac.',
        'F. Entrada',
        'Origen',
        'Granja',
        'Ubicación',
        'Estado',
        'Est. Reprod.',
        'Peso (kg)',
        'Peso Mín. (kg)',
        'Cond. Corp.',
        'F. Pesaje',
        'Partos'
      ]],
      body: tableData,
      theme: 'striped',
      styles: {
        fontSize: 7,
        cellPadding: 2,
        overflow: 'linebreak',
        halign: 'center',
        valign: 'middle'
      },
      headStyles: { 
        fillColor: primaryColor,
        fontSize: 7,
        fontStyle: 'bold',
        halign: 'center',
        textColor: [255, 255, 255]
      },
      bodyStyles: { 
        fontSize: 6.5,
        textColor: [50, 50, 50]
      },
      alternateRowStyles: { 
        fillColor: [252, 245, 248] // Rosa muy claro
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' }, // #
        1: { cellWidth: 15, fontStyle: 'bold' }, // Arete
        2: { cellWidth: 12 }, // Alias
        3: { cellWidth: 14 }, // Raza
        4: { cellWidth: 12 }, // Línea
        5: { cellWidth: 8 }, // Gen
        6: { cellWidth: 12 }, // Padre
        7: { cellWidth: 12 }, // Madre
        8: { cellWidth: 16 }, // F. Nac
        9: { cellWidth: 16 }, // F. Entrada
        10: { cellWidth: 12 }, // Origen
        11: { cellWidth: 15 }, // Granja
        12: { cellWidth: 14 }, // Ubicación
        13: { cellWidth: 12 }, // Estado
        14: { cellWidth: 14 }, // Est. Reprod
        15: { cellWidth: 10 }, // Peso
        16: { cellWidth: 10 }, // Peso Mín
        17: { cellWidth: 10 }, // Cond. Corp
        18: { cellWidth: 16 }, // F. Pesaje
        19: { cellWidth: 8 } // Partos
      },
      margin: { left: 5, right: 5, top: 45, bottom: 20 },
      didDrawPage: function() {
        // Pie de página en cada página
        const pageCount = doc.internal.getNumberOfPages();
        const pageNumber = doc.internal.getCurrentPageInfo().pageNumber;
        
        // Línea decorativa
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(10, doc.internal.pageSize.getHeight() - 15, pageWidth - 10, doc.internal.pageSize.getHeight() - 15);
        
        // Texto del pie de página
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.setFont(undefined, 'normal');
        
        // Izquierda: Usuario
        doc.text(`Generado por: ${userName}`, 10, doc.internal.pageSize.getHeight() - 10);
        
        // Centro: Fecha
        doc.text(
          `${new Date().toLocaleDateString('es-ES')}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
        
        // Derecha: Página
        doc.text(
          `Página ${pageNumber} de ${pageCount}`,
          pageWidth - 10,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'right' }
        );
      }
    });
    
    console.log('Guardando PDF de lista completa...');
    doc.save(`Lista_Cerdas_Completa_${new Date().toISOString().split('T')[0]}.pdf`);
    console.log('PDF de lista guardado exitosamente');
  } catch (error) {
    console.error('Error al exportar PDF de lista:', error);
    alert('Error al generar el PDF: ' + error.message);
  }
};

/**
 * Exportar una cerda individual a Excel
 */
export const exportSowToExcel = (sow) => {
  try {
    console.log('Iniciando exportación Excel de cerda:', sow);
    
    // Obtener información del usuario
    let userName = 'Usuario';
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Usuario';
      }
    } catch (e) {
      console.log('No se pudo obtener el usuario:', e);
    }
    
    const currentDate = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Crear workbook
    const wb = XLSX.utils.book_new();
    
    // Preparar datos con información del usuario
    const data = [
      ['FICHA DE CERDA REPRODUCTORA'],
      [''],
      ['Generado por:', userName],
      ['Fecha de generación:', currentDate],
      [''],
      ['IDENTIFICACIÓN'],
      ['Arete', sow.ear_tag || 'N/A'],
      ['Tipo de ID', sow.id_type || 'N/A'],
      ['Alias', sow.alias || 'Sin alias'],
      [''],
      ['GENÉTICA'],
      ['Raza', sow.breed || 'N/A'],
      ['Línea Genética', sow.genetic_line || 'No especificada'],
      ['Generación', sow.generation || 'No especificada'],
      ['Arete del Padre', sow.sire_tag || 'No registrado'],
      ['Arete de la Madre', sow.dam_tag || 'No registrado'],
      [''],
      ['FECHAS Y ORIGEN'],
      ['Fecha de Nacimiento', formatDate(sow.birth_date)],
      ['Fecha de Entrada', formatDate(sow.entry_date)],
      ['Origen', sow.origin || 'N/A'],
      [''],
      ['UBICACIÓN'],
      ['Granja', sow.farm_name || 'No especificada'],
      ['Ubicación/Galpón', sow.location || 'No especificada'],
      [''],
      ['ESTADO'],
      ['Estado General', sow.status || 'N/A'],
      ['Estado Reproductivo', sow.reproductive_status || 'vacia'],
      [''],
      ['DATOS FÍSICOS'],
      ['Peso Actual', `${sow.current_weight || 'N/A'} kg`],
      ['Peso Mínimo Servicio', `${sow.min_service_weight || 'No especificado'} kg`],
      ['Condición Corporal', sow.body_condition || 'N/A'],
      ['Fecha Último Pesaje', formatDate(sow.last_weight_date)],
      [''],
      ['REGISTRO'],
      ['Fecha de Creación', formatDate(sow.created_at)],
      ['Última Actualización', formatDate(sow.updated_at)],
    ];
    
    // Crear worksheet
    const ws = XLSX.utils.aoa_to_sheet(data);
    
    // Ajustar ancho de columnas
    ws['!cols'] = [
      { wch: 28 },
      { wch: 45 }
    ];
    
    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Cerda');
    
    // Guardar archivo
    console.log('Guardando Excel...');
    XLSX.writeFile(wb, `Ficha_Cerda_${sow.ear_tag}_${new Date().toISOString().split('T')[0]}.xlsx`);
    console.log('Excel guardado exitosamente');
  } catch (error) {
    console.error('Error al exportar Excel:', error);
    alert('Error al generar el archivo Excel: ' + error.message);
  }
};

/**
 * Exportar todas las cerdas a Excel (formato tabla)
 */
export const exportAllSowsToExcel = (sows) => {
  try {
    console.log('Iniciando exportación Excel de todas las cerdas:', sows.length);
    
    // Obtener información del usuario
    let userName = 'Usuario';
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Usuario';
      }
    } catch (e) {
      console.log('No se pudo obtener el usuario:', e);
    }
    
    const currentDate = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Crear workbook
    const wb = XLSX.utils.book_new();
    
    // Preparar encabezados con TODOS los campos
    const infoRows = [
      ['REGISTRO DE CERDAS REPRODUCTORAS'],
      [''],
      ['Generado por:', userName],
      ['Fecha de generación:', currentDate],
      ['Total de registros:', sows.length],
      ['']
    ];
    
    const headers = [
      '#',
      'Arete',
      'Tipo ID',
      'Alias',
      'Raza',
      'Línea Genética',
      'Generación',
      'Arete Padre',
      'Arete Madre',
      'Fecha Nacimiento',
      'Fecha Entrada',
      'Origen',
      'Granja',
      'Ubicación/Galpón',
      'Estado General',
      'Estado Reproductivo',
      'Peso Actual (kg)',
      'Peso Mín. Servicio (kg)',
      'Condición Corporal',
      'Fecha Último Pesaje',
      'Número de Partos',
      'Fecha Creación',
      'Última Actualización'
    ];
    
    // Preparar datos con TODOS los campos
    const data = sows.map((sow, index) => [
      index + 1,
      sow.ear_tag || 'N/A',
      sow.id_type || 'N/A',
      sow.alias || '-',
      sow.breed || 'N/A',
      sow.genetic_line || '-',
      sow.generation || '-',
      sow.sire_tag || '-',
      sow.dam_tag || '-',
      formatDate(sow.birth_date),
      formatDate(sow.entry_date),
      sow.origin || 'N/A',
      sow.farm_name || '-',
      sow.location || '-',
      sow.status || 'N/A',
      sow.reproductive_status || 'vacia',
      sow.current_weight || '-',
      sow.min_service_weight || '-',
      sow.body_condition || '-',
      formatDate(sow.last_weight_date),
      sow.parity_count || '0',
      formatDate(sow.created_at),
      formatDate(sow.updated_at)
    ]);
    
    // Combinar información, encabezados y datos
    const allData = [...infoRows, headers, ...data];
    
    // Crear worksheet con toda la información
    const ws = XLSX.utils.aoa_to_sheet(allData);
    
    // Ajustar ancho de columnas
    ws['!cols'] = [
      { wch: 5 },  // #
      { wch: 15 }, // Arete
      { wch: 12 }, // Tipo ID
      { wch: 15 }, // Alias
      { wch: 15 }, // Raza
      { wch: 18 }, // Línea Genética
      { wch: 12 }, // Generación
      { wch: 15 }, // Padre
      { wch: 15 }, // Madre
      { wch: 20 }, // Fecha Nacimiento
      { wch: 20 }, // Fecha Entrada
      { wch: 18 }, // Origen
      { wch: 20 }, // Granja
      { wch: 18 }, // Ubicación
      { wch: 15 }, // Estado General
      { wch: 18 }, // Estado Reproductivo
      { wch: 15 }, // Peso Actual
      { wch: 18 }, // Peso Mín.
      { wch: 18 }, // Condición Corporal
      { wch: 20 }, // Fecha Pesaje
      { wch: 12 }, // Partos
      { wch: 20 }, // Fecha Creación
      { wch: 20 }  // Última Actualización
    ];
    
    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Cerdas');
    
    // Guardar archivo
    console.log('Guardando Excel de lista completa...');
    XLSX.writeFile(wb, `Lista_Cerdas_Completa_${new Date().toISOString().split('T')[0]}.xlsx`);
    console.log('Excel de lista guardado exitosamente');
  } catch (error) {
    console.error('Error al exportar Excel de lista:', error);
    alert('Error al generar el archivo Excel: ' + error.message);
  }
};

// ============================================================================
// FUNCIONES DE EXPORTACIÓN PARA VERRACOS
// ============================================================================

/**
 * Exportar un verraco individual a PDF
 */
export const exportBoarToPDF = (boar) => {
  try {
    console.log('Iniciando exportación PDF de verraco:', boar);
    
    // Obtener información del usuario
    let userName = 'Usuario';
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Usuario';
      }
    } catch (e) {
      console.log('No se pudo obtener el usuario:', e);
    }
    
    const doc = new jsPDF();
    
    // Configuración de colores - Azul para verracos
    const primaryColor = [37, 99, 235]; // Azul
    
    // Encabezado mejorado
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont(undefined, 'bold');
    doc.text('FICHA DE VERRACO REPRODUCTOR', 105, 15, { align: 'center' });
    doc.setFontSize(16);
    doc.setFont(undefined, 'normal');
    doc.text(`Arete: ${boar.ear_tag}`, 105, 25, { align: 'center' });
    
    // Información del reporte
    doc.setFontSize(9);
    const currentDate = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generado: ${currentDate} | Por: ${userName}`, 105, 35, { align: 'center' });
    
    // Agregar imagen si existe
    let yPosition = 50;
    if (boar.photo_url) {
      try {
        doc.addImage(boar.photo_url, 'JPEG', 75, yPosition, 60, 60);
        yPosition += 70;
      } catch (error) {
        console.log('No se pudo agregar la imagen:', error);
        yPosition += 10;
      }
    }
    
    // Resetear color de texto
    doc.setTextColor(0, 0, 0);
  
    // Sección 1: Identificación
    doc.setFillColor(240, 240, 240);
    doc.rect(10, yPosition, 190, 8, 'F');
    doc.setFontSize(12);
    doc.setFont(undefined, 'bold');
    doc.text('IDENTIFICACION', 15, yPosition + 6);
    yPosition += 12;
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Campo', 'Valor']],
      body: [
        ['Arete', boar.ear_tag || 'N/A'],
        ['Tipo de ID', boar.id_type || 'N/A'],
        ['Nombre', boar.name || 'Sin nombre'],
      ],
      theme: 'striped',
      headStyles: { fillColor: primaryColor },
      margin: { left: 15, right: 15 },
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // Sección 2: Genética
    doc.setFillColor(240, 240, 240);
    doc.rect(10, yPosition, 190, 8, 'F');
    doc.setFont(undefined, 'bold');
    doc.text('GENETICA', 15, yPosition + 6);
    yPosition += 12;
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Campo', 'Valor']],
      body: [
        ['Raza', boar.breed || 'N/A'],
        ['Línea Genética', boar.genetic_line || 'No especificada'],
        ['Generación', boar.generation || 'No especificada'],
        ['Arete del Padre', boar.sire_ear_tag || 'No registrado'],
        ['Arete de la Madre', boar.dam_ear_tag || 'No registrado'],
      ],
      theme: 'striped',
      headStyles: { fillColor: primaryColor },
      margin: { left: 15, right: 15 },
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // Verificar si necesitamos una nueva página
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Sección 3: Tipo de Verraco
    doc.setFillColor(240, 240, 240);
    doc.rect(10, yPosition, 190, 8, 'F');
    doc.setFont(undefined, 'bold');
    doc.text('TIPO DE VERRACO', 15, yPosition + 6);
    yPosition += 12;
    
    const boarTypeBody = [
      ['Tipo', boar.boar_type === 'fisico' ? 'Físico' : 'Semen Comprado'],
    ];
    
    if (boar.boar_type === 'semen comprado') {
      boarTypeBody.push(
        ['Proveedor', boar.supplier_name || 'No especificado'],
        ['Código Proveedor', boar.supplier_code || 'No especificado']
      );
    } else {
      boarTypeBody.push(
        ['Total Servicios', boar.total_services || '0'],
        ['Último Servicio', formatDate(boar.last_service_date)]
      );
    }
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Campo', 'Valor']],
      body: boarTypeBody,
      theme: 'striped',
      headStyles: { fillColor: primaryColor },
      margin: { left: 15, right: 15 },
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // Sección 4: Fechas y Origen
    doc.setFillColor(240, 240, 240);
    doc.rect(10, yPosition, 190, 8, 'F');
    doc.setFont(undefined, 'bold');
    doc.text('FECHAS Y ORIGEN', 15, yPosition + 6);
    yPosition += 12;
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Campo', 'Valor']],
      body: [
        ['Fecha de Nacimiento', formatDate(boar.birth_date)],
        ['Fecha de Entrada', formatDate(boar.entry_date)],
        ['Origen', boar.origin || 'N/A'],
      ],
      theme: 'striped',
      headStyles: { fillColor: primaryColor },
      margin: { left: 15, right: 15 },
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // Verificar si necesitamos una nueva página
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }
    
    // Sección 5: Ubicación (solo para verracos físicos)
    if (boar.boar_type === 'fisico') {
      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPosition, 190, 8, 'F');
      doc.setFont(undefined, 'bold');
      doc.text('UBICACION', 15, yPosition + 6);
      yPosition += 12;
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Campo', 'Valor']],
        body: [
          ['Granja', boar.farm_name || 'No especificada'],
          ['Ubicación/Galpón', boar.location || 'No especificada'],
        ],
        theme: 'striped',
        headStyles: { fillColor: primaryColor },
        margin: { left: 15, right: 15 },
      });
      
      yPosition = doc.lastAutoTable.finalY + 10;
    }
    
    // Sección 6: Estado
    doc.setFillColor(240, 240, 240);
    doc.rect(10, yPosition, 190, 8, 'F');
    doc.setFont(undefined, 'bold');
    doc.text('ESTADO', 15, yPosition + 6);
    yPosition += 12;
    
    autoTable(doc, {
      startY: yPosition,
      head: [['Campo', 'Valor']],
      body: [
        ['Estado General', boar.status || 'N/A'],
      ],
      theme: 'striped',
      headStyles: { fillColor: primaryColor },
      margin: { left: 15, right: 15 },
    });
    
    yPosition = doc.lastAutoTable.finalY + 10;
    
    // Sección 7: Datos Físicos
    if (boar.current_weight) {
      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPosition, 190, 8, 'F');
      doc.setFont(undefined, 'bold');
      doc.text('DATOS FISICOS', 15, yPosition + 6);
      yPosition += 12;
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Campo', 'Valor']],
        body: [
          ['Peso Actual', `${boar.current_weight || 'N/A'} kg`],
        ],
        theme: 'striped',
        headStyles: { fillColor: primaryColor },
        margin: { left: 15, right: 15 },
      });
      
      yPosition = doc.lastAutoTable.finalY + 10;
    }
    
    // Sección 8: Notas
    if (boar.notes) {
      // Verificar si necesitamos una nueva página
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }
      
      doc.setFillColor(240, 240, 240);
      doc.rect(10, yPosition, 190, 8, 'F');
      doc.setFont(undefined, 'bold');
      doc.text('OBSERVACIONES', 15, yPosition + 6);
      yPosition += 12;
      
      autoTable(doc, {
        startY: yPosition,
        head: [['Notas']],
        body: [[boar.notes]],
        theme: 'striped',
        headStyles: { fillColor: primaryColor },
        margin: { left: 15, right: 15 },
      });
    }
    
    // Pie de página mejorado
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      
      // Línea decorativa
      doc.setDrawColor(...primaryColor);
      doc.setLineWidth(0.5);
      doc.line(15, 283, 195, 283);
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.setFont(undefined, 'normal');
      
      // Izquierda: Usuario
      doc.text(`Generado por: ${userName}`, 15, 288);
      
      // Centro: Fecha
      doc.text(
        `${new Date().toLocaleDateString('es-ES')}`,
        105,
        288,
        { align: 'center' }
      );
      
      // Derecha: Página
      doc.text(
        `Página ${i} de ${pageCount}`,
        195,
        288,
        { align: 'right' }
      );
    }
    
    // Guardar el PDF
    console.log('Guardando PDF de verraco...');
    doc.save(`Ficha_Verraco_${boar.ear_tag}_${new Date().toISOString().split('T')[0]}.pdf`);
    console.log('PDF de verraco guardado exitosamente');
  } catch (error) {
    console.error('Error al exportar PDF de verraco:', error);
    alert('Error al generar el PDF: ' + error.message);
  }
};

/**
 * Exportar todos los verracos a PDF (formato tabla)
 */
export const exportAllBoarsToPDF = (boars) => {
  try {
    console.log('Iniciando exportación PDF de todos los verracos:', boars.length);
    
    // Obtener información del usuario
    let userName = 'Usuario';
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Usuario';
      }
    } catch (e) {
      console.log('No se pudo obtener el usuario:', e);
    }
    
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    const primaryColor = [37, 99, 235]; // Azul
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Encabezado
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, pageWidth, 35, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont(undefined, 'bold');
    doc.text('LISTADO DE VERRACOS REPRODUCTORES', pageWidth / 2, 15, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    const currentDate = new Date().toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generado: ${currentDate} | Por: ${userName}`, pageWidth / 2, 23, { align: 'center' });
    doc.text(`Total de verracos: ${boars.length}`, pageWidth / 2, 29, { align: 'center' });
    
    // Resetear color
    doc.setTextColor(0, 0, 0);
    
    // Preparar datos para la tabla
    const tableData = boars.map((boar, index) => [
      index + 1,
      boar.ear_tag || 'N/A',
      boar.id_type || 'N/A',
      boar.name || 'Sin nombre',
      boar.breed || 'N/A',
      boar.boar_type === 'fisico' ? 'Físico' : 'Semen Comprado',
      boar.origin || 'N/A',
      boar.farm_name || 'N/A',
      boar.status || 'N/A',
      boar.total_services || '0',
      formatDate(boar.birth_date),
      formatDate(boar.created_at)
    ]);
    
    // Crear tabla
    autoTable(doc, {
      startY: 40,
      head: [[
        '#',
        'Arete',
        'Tipo ID',
        'Nombre',
        'Raza',
        'Tipo',
        'Origen',
        'Granja',
        'Estado',
        'Servicios',
        'F. Nacimiento',
        'F. Registro'
      ]],
      body: tableData,
      theme: 'striped',
      headStyles: { 
        fillColor: primaryColor,
        fontSize: 8,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 7
      },
      columnStyles: {
        0: { cellWidth: 8 },  // #
        1: { cellWidth: 20 }, // Arete
        2: { cellWidth: 15 }, // Tipo ID
        3: { cellWidth: 25 }, // Nombre
        4: { cellWidth: 20 }, // Raza
        5: { cellWidth: 25 }, // Tipo
        6: { cellWidth: 20 }, // Origen
        7: { cellWidth: 25 }, // Granja
        8: { cellWidth: 18 }, // Estado
        9: { cellWidth: 18 }, // Servicios
        10: { cellWidth: 23 }, // F. Nacimiento
        11: { cellWidth: 23 }  // F. Registro
      },
      margin: { left: 10, right: 10 },
      didDrawPage: () => {
        // Pie de página
        const pageCount = doc.internal.getNumberOfPages();
        const currentPage = doc.internal.getCurrentPageInfo().pageNumber;
        
        doc.setDrawColor(...primaryColor);
        doc.setLineWidth(0.5);
        doc.line(10, doc.internal.pageSize.getHeight() - 15, pageWidth - 10, doc.internal.pageSize.getHeight() - 15);
        
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(`Generado por: ${userName}`, 10, doc.internal.pageSize.getHeight() - 10);
        doc.text(
          `${new Date().toLocaleDateString('es-ES')}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
        doc.text(
          `Página ${currentPage} de ${pageCount}`,
          pageWidth - 10,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'right' }
        );
      }
    });
    
    // Guardar el PDF
    console.log('Guardando PDF de lista de verracos...');
    doc.save(`Listado_Verracos_${new Date().toISOString().split('T')[0]}.pdf`);
    console.log('PDF de lista de verracos guardado exitosamente');
  } catch (error) {
    console.error('Error al exportar PDF de lista de verracos:', error);
    alert('Error al generar el PDF: ' + error.message);
  }
};

/**
 * Exportar un verraco individual a Excel
 */
export const exportBoarToExcel = (boar) => {
  try {
    console.log('Iniciando exportación Excel de verraco:', boar);
    
    // Obtener información del usuario
    let userName = 'Usuario';
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Usuario';
      }
    } catch (e) {
      console.log('No se pudo obtener el usuario:', e);
    }
    
    // Crear workbook
    const wb = XLSX.utils.book_new();
    
    // Información del reporte (primeras filas)
    const currentDate = new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const infoRows = [
      ['FICHA DE VERRACO REPRODUCTOR'],
      [],
      ['Arete:', boar.ear_tag],
      ['Generado:', currentDate],
      ['Por:', userName],
      [],
      []
    ];
    
    // Datos del verraco organizados por secciones
    const data = [
      ['SECCIÓN', 'CAMPO', 'VALOR'],
      [],
      ['IDENTIFICACIÓN', 'Arete', boar.ear_tag || 'N/A'],
      ['IDENTIFICACIÓN', 'Tipo de ID', boar.id_type || 'N/A'],
      ['IDENTIFICACIÓN', 'Nombre', boar.name || 'Sin nombre'],
      [],
      ['GENÉTICA', 'Raza', boar.breed || 'N/A'],
      ['GENÉTICA', 'Línea Genética', boar.genetic_line || 'No especificada'],
      ['GENÉTICA', 'Generación', boar.generation || 'No especificada'],
      ['GENÉTICA', 'Arete del Padre', boar.sire_ear_tag || 'No registrado'],
      ['GENÉTICA', 'Arete de la Madre', boar.dam_ear_tag || 'No registrado'],
      [],
      ['TIPO DE VERRACO', 'Tipo', boar.boar_type === 'fisico' ? 'Físico' : 'Semen Comprado'],
    ];
    
    if (boar.boar_type === 'semen comprado') {
      data.push(
        ['TIPO DE VERRACO', 'Proveedor', boar.supplier_name || 'No especificado'],
        ['TIPO DE VERRACO', 'Código Proveedor', boar.supplier_code || 'No especificado']
      );
    } else {
      data.push(
        ['TIPO DE VERRACO', 'Total Servicios', boar.total_services || '0'],
        ['TIPO DE VERRACO', 'Último Servicio', formatDate(boar.last_service_date)]
      );
    }
    
    data.push(
      [],
      ['FECHAS Y ORIGEN', 'Fecha de Nacimiento', formatDate(boar.birth_date)],
      ['FECHAS Y ORIGEN', 'Fecha de Entrada', formatDate(boar.entry_date)],
      ['FECHAS Y ORIGEN', 'Origen', boar.origin || 'N/A'],
      []
    );
    
    if (boar.boar_type === 'fisico') {
      data.push(
        ['UBICACIÓN', 'Granja', boar.farm_name || 'No especificada'],
        ['UBICACIÓN', 'Ubicación/Galpón', boar.location || 'No especificada'],
        []
      );
    }
    
    data.push(
      ['ESTADO', 'Estado General', boar.status || 'N/A'],
      []
    );
    
    if (boar.current_weight) {
      data.push(
        ['DATOS FÍSICOS', 'Peso Actual', `${boar.current_weight} kg`],
        []
      );
    }
    
    if (boar.notes) {
      data.push(
        ['OBSERVACIONES', 'Notas', boar.notes],
        []
      );
    }
    
    data.push(
      ['REGISTRO', 'Fecha de Creación', formatDate(boar.created_at)],
      ['REGISTRO', 'Última Actualización', formatDate(boar.updated_at)],
      ['REGISTRO', 'Creado por', boar.created_by || 'N/A'],
      ['REGISTRO', 'Actualizado por', boar.updated_by || 'N/A']
    );
    
    // Combinar información y datos
    const allData = [...infoRows, ...data];
    
    // Crear worksheet
    const ws = XLSX.utils.aoa_to_sheet(allData);
    
    // Ajustar ancho de columnas
    ws['!cols'] = [
      { wch: 20 }, // Sección
      { wch: 25 }, // Campo
      { wch: 40 }  // Valor
    ];
    
    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Ficha Verraco');
    
    // Guardar archivo
    console.log('Guardando Excel de verraco...');
    XLSX.writeFile(wb, `Ficha_Verraco_${boar.ear_tag}_${new Date().toISOString().split('T')[0]}.xlsx`);
    console.log('Excel de verraco guardado exitosamente');
  } catch (error) {
    console.error('Error al exportar Excel de verraco:', error);
    alert('Error al generar el archivo Excel: ' + error.message);
  }
};

/**
 * Exportar todos los verracos a Excel
 */
export const exportAllBoarsToExcel = (boars) => {
  try {
    console.log('Iniciando exportación Excel de todos los verracos:', boars.length);
    
    // Obtener información del usuario
    let userName = 'Usuario';
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        userName = `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email || 'Usuario';
      }
    } catch (e) {
      console.log('No se pudo obtener el usuario:', e);
    }
    
    const wb = XLSX.utils.book_new();
    
    // Información del reporte
    const currentDate = new Date().toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    const infoRows = [
      ['LISTADO DE VERRACOS REPRODUCTORES'],
      [],
      ['Generado:', currentDate],
      ['Por:', userName],
      ['Total de verracos:', boars.length],
      [],
      []
    ];
    
    // Encabezados de columnas
    const headers = [
      '#',
      'Arete',
      'Tipo ID',
      'Nombre',
      'Raza',
      'Línea Genética',
      'Generación',
      'Padre',
      'Madre',
      'Fecha Nacimiento',
      'Fecha Entrada',
      'Origen',
      'Tipo Verraco',
      'Granja',
      'Ubicación',
      'Estado',
      'Peso Actual',
      'Total Servicios',
      'Proveedor',
      'Código Proveedor',
      'Fecha Creación',
      'Última Actualización'
    ];
    
    // Datos
    const data = boars.map((boar, index) => [
      index + 1,
      boar.ear_tag || '-',
      boar.id_type || '-',
      boar.name || '-',
      boar.breed || '-',
      boar.genetic_line || '-',
      boar.generation || '-',
      boar.sire_ear_tag || '-',
      boar.dam_ear_tag || '-',
      formatDate(boar.birth_date),
      formatDate(boar.entry_date),
      boar.origin || '-',
      boar.boar_type === 'fisico' ? 'Físico' : 'Semen Comprado',
      boar.farm_name || '-',
      boar.location || '-',
      boar.status || '-',
      boar.current_weight || '-',
      boar.total_services || '0',
      boar.supplier_name || '-',
      boar.supplier_code || '-',
      formatDate(boar.created_at),
      formatDate(boar.updated_at)
    ]);
    
    // Combinar información, encabezados y datos
    const allData = [...infoRows, headers, ...data];
    
    // Crear worksheet con toda la información
    const ws = XLSX.utils.aoa_to_sheet(allData);
    
    // Ajustar ancho de columnas
    ws['!cols'] = [
      { wch: 5 },  // #
      { wch: 15 }, // Arete
      { wch: 12 }, // Tipo ID
      { wch: 20 }, // Nombre
      { wch: 15 }, // Raza
      { wch: 18 }, // Línea Genética
      { wch: 12 }, // Generación
      { wch: 15 }, // Padre
      { wch: 15 }, // Madre
      { wch: 20 }, // Fecha Nacimiento
      { wch: 20 }, // Fecha Entrada
      { wch: 18 }, // Origen
      { wch: 18 }, // Tipo Verraco
      { wch: 20 }, // Granja
      { wch: 18 }, // Ubicación
      { wch: 15 }, // Estado
      { wch: 15 }, // Peso Actual
      { wch: 15 }, // Total Servicios
      { wch: 25 }, // Proveedor
      { wch: 20 }, // Código Proveedor
      { wch: 20 }, // Fecha Creación
      { wch: 20 }  // Última Actualización
    ];
    
    // Agregar worksheet al workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Verracos');
    
    // Guardar archivo
    console.log('Guardando Excel de lista completa de verracos...');
    XLSX.writeFile(wb, `Lista_Verracos_Completa_${new Date().toISOString().split('T')[0]}.xlsx`);
    console.log('Excel de lista de verracos guardado exitosamente');
  } catch (error) {
    console.error('Error al exportar Excel de lista de verracos:', error);
    alert('Error al generar el archivo Excel: ' + error.message);
  }
};

