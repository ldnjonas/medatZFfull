import PDFDocument from 'pdfkit';

export async function generatePDF(tasks, system) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40, size: 'A4' });
    const chunks = [];
    
    doc.on('data', chunk => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);
    
    // Header - check if mixed systems
    const isMixed = system === 'gemischt' || (tasks.length > 0 && tasks[0].systemId);
    const headerText = isMixed 
      ? 'MedAT Zahlenfolgen - Gemischte Systeme' 
      : `MedAT Zahlenfolgen - System ${system}`;
    doc.fontSize(16).text(headerText, { align: 'center' });
    doc.moveDown(0.5);
    
    const tasksPerPage = 5;
    
    // Generate tasks
    tasks.forEach((task, taskIndex) => {
      // Start new page every 5 tasks (except for the first page)
      if (taskIndex > 0 && taskIndex % tasksPerPage === 0) {
        doc.addPage();
      }
      
      // Task number and system label (if mixed)
      let taskHeader = `${taskIndex + 1}.`;
      if (isMixed && task.systemId) {
        taskHeader += ` (System ${task.systemId})`;
      }
      doc.fontSize(11).text(taskHeader, { underline: true });
      doc.moveDown(0.2);
      
      // Sequence (first 7 numbers) with | separators and ... | ... for positions 8 and 9
      // Ensure all sequence values are numbers
      const sequenceNumbers = task.sequence.map(num => Number(num)).filter(num => !isNaN(num) && isFinite(num));
      const sequenceText = sequenceNumbers.join(' | ') + ' | ... | ...';
      doc.fontSize(10).text(sequenceText);
      doc.moveDown(0.3);
      
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
        doc.fontSize(9).text(optionText);
      });
      
      // Answer key (for teacher/checking - could be removed or made optional)
      doc.moveDown(0.2);
      const correctOption = task.options.find(opt => opt.isCorrect)?.label || '?';
      const correctPos8 = task.correctAnswer?.position8 != null ? Number(task.correctAnswer.position8) : 0;
      const correctPos9 = task.correctAnswer?.position9 != null ? Number(task.correctAnswer.position9) : 0;
      doc.fontSize(8).fillColor('gray').text(
        `Lösung: ${correctOption} (${correctPos8} / ${correctPos9})`,
        { align: 'right' }
      );
      doc.fillColor('black');
      
      // Add spacing between tasks (except after the last task on a page)
      if ((taskIndex + 1) % tasksPerPage !== 0) {
        doc.moveDown(0.4);
      }
    });
    
    doc.end();
  });
}
