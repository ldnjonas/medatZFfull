import PDFDocument from 'pdfkit';

export async function generatePDF(tasks, system) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const chunks = [];
    
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    
    // Header
    doc.fontSize(20).text(`MedAT Zahlenfolgen - System ${system}`, { align: 'center' });
    doc.moveDown(2);
    
    // Generate tasks
    tasks.forEach((task, taskIndex) => {
      if (taskIndex > 0) {
        doc.addPage();
      }
      
      // Task number
      doc.fontSize(16).text(`${taskIndex + 1}.`, { underline: true });
      doc.moveDown();
      
      // Sequence (first 7 numbers) with | separators and ... | ... for positions 8 and 9
      // Ensure all sequence values are numbers
      const sequenceNumbers = task.sequence.map(num => Number(num)).filter(num => !isNaN(num) && isFinite(num));
      const sequenceText = sequenceNumbers.join(' | ') + ' | ... | ...';
      doc.fontSize(14).text(sequenceText);
      doc.moveDown(1.5);
      
      // Answer options (A-E) with format "pos8 / pos9"
      task.options.forEach(option => {
        let optionText = `${option.label}. `;
        if (option.isNone) {
          optionText += 'Keine der gegebenen Antworten ist richtig.';
        } else {
          // Ensure values are numbers and format them
          const pos8 = option.position8 != null ? Number(option.position8) : 0;
          const pos9 = option.position9 != null ? Number(option.position9) : 0;
          optionText += `${pos8} / ${pos9}`;
        }
        doc.fontSize(12).text(optionText);
      });
      
      // Answer key (for teacher/checking - could be removed or made optional)
      doc.moveDown(1);
      const correctOption = task.options.find(opt => opt.isCorrect)?.label || '?';
      const correctPos8 = task.correctAnswer?.position8 != null ? Number(task.correctAnswer.position8) : 0;
      const correctPos9 = task.correctAnswer?.position9 != null ? Number(task.correctAnswer.position9) : 0;
      doc.fontSize(10).fillColor('gray').text(
        `Lösung: ${correctOption} (${correctPos8} / ${correctPos9})`,
        { align: 'right' }
      );
      doc.fillColor('black');
    });
    
    doc.end();
  });
}
