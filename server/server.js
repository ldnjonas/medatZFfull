import express from 'express';
import cors from 'cors';
import { generatePDF } from './pdfGenerator.js';
import { generateSystem01Task } from './systems/system01.js';
import { generateSystem02Task } from './systems/system02.js';
import { generateSystem03Task } from './systems/system03.js';
import { generateSystem04Task } from './systems/system04.js';
import { generateSystem05Task } from './systems/system05.js';
import { generateSystem06Task } from './systems/system06.js';
import { generateSystem07Task } from './systems/system07.js';
import { generateSystem08Task } from './systems/system08.js';
import { generateSystem09Task } from './systems/system09.js';
import { generateSystem10Task } from './systems/system10.js';
import { generateSystem11Task } from './systems/system11.js';
import { generateSystem12Task } from './systems/system12.js';
import { generateSystem13Task } from './systems/system13.js';
import { generateSystem14Task } from './systems/system14.js';
import { generateSystem15Task } from './systems/system15.js';
import { generateSystem16Task } from './systems/system16.js';
import { generateSystem17Task } from './systems/system17.js';
import { generateSystem18Task } from './systems/system18.js';
import { generateSystem19Task } from './systems/system19.js';
import { generateSystem20Task } from './systems/system20.js';
import { generateSystem21Task } from './systems/system21.js';
import { generateSystem22Task } from './systems/system22.js';
import { generateSystem23Task } from './systems/system23.js';
import { generateSystem24Task } from './systems/system24.js';
import { generateSystem25Task } from './systems/system25.js';
import { generateSystem26Task } from './systems/system26.js';
import { generateSystem28Task } from './systems/system28.js';
import { generateSystem29Task } from './systems/system29.js';
import { generateSystem30Task } from './systems/system30.js';
import { generateSystem31Task } from './systems/system31.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// System 01: Pattern -16, x2, -16, x2, -16, x2...
// Starting sequence: 34, 18, 36, 20, 40, 24, 48
// Next: 48 - 16 = 32, then 32 * 2 = 64

app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { system, count = 1 } = req.body;
    
    let tasks = [];
    
    if (system === '01') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem01Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 01:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '02') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem02Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 02:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '03') {
      for (let i = 0; i < count; i++) {
        let taskGenerated = false;
        let attempts = 0;
        
        // Try up to 10 times to generate a valid task
        while (!taskGenerated && attempts < 10) {
          try {
            const task = generateSystem03Task();
            
            // Validate task structure
            if (task && 
                task.sequence && 
                Array.isArray(task.sequence) && 
                task.sequence.length === 7 &&
                task.correctAnswer &&
                typeof task.correctAnswer.position8 === 'number' &&
                typeof task.correctAnswer.position9 === 'number' &&
                task.options &&
                Array.isArray(task.options) &&
                task.options.length === 5) {
              
              // Validate all sequence numbers
              const allValid = task.sequence.every(num => 
                Number.isInteger(num) && num > 0 && num <= 100000 && isFinite(num)
              ) &&
              Number.isInteger(task.correctAnswer.position8) && 
              task.correctAnswer.position8 > 0 && 
              task.correctAnswer.position8 <= 100000 &&
              Number.isInteger(task.correctAnswer.position9) && 
              task.correctAnswer.position9 > 0 && 
              task.correctAnswer.position9 <= 100000;
              
              if (allValid) {
                tasks.push(task);
                taskGenerated = true;
              }
            }
          } catch (error) {
            console.error(`Error generating task ${i + 1} for system 03 (attempt ${attempts + 1}):`, error);
          }
          attempts++;
        }
        
        if (!taskGenerated) {
          console.error(`Failed to generate task ${i + 1} for system 03 after 10 attempts`);
        }
      }
    } else if (system === '04') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem04Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 04:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '05') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem05Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 05:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '06') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem06Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 06:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '07') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem07Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 07:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '08') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem08Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 08:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '09') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem09Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 09:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '10') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem10Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 10:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '11') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem11Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 11:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '12') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem12Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 12:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '13') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem13Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 13:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '14') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem14Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 14:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '15') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem15Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 15:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '16') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem16Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 16:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '17') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem17Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 17:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '18') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem18Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 18:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '19') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem19Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 19:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '20') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem20Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 20:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '21') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem21Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 21:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '22') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem22Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 22:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '23') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem23Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 23:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '24') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem24Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 24:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '25') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem25Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 25:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '26') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem26Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 26:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '28') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem28Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 28:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '29') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem29Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 29:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '30') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem30Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 30:`, error);
          // Skip this task and continue
        }
      }
    } else if (system === '31') {
      for (let i = 0; i < count; i++) {
        try {
          const task = generateSystem31Task();
          if (task && task.sequence && task.correctAnswer && task.options) {
            tasks.push(task);
          }
        } catch (error) {
          console.error(`Error generating task ${i + 1} for system 31:`, error);
          // Skip this task and continue
        }
      }
    } else {
      return res.status(400).json({ error: 'System not implemented yet' });
    }
    
    if (tasks.length === 0) {
      return res.status(500).json({ error: 'Failed to generate any valid tasks' });
    }
    
    const pdfBuffer = await generatePDF(tasks, system);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=medat-system-${system}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF: ' + error.message });
  }
});

app.get('/api/systems', (req, res) => {
  res.json({
    systems: [
      { id: '01', name: 'System 01', description: 'Zwei abwechselnde Operationen (z.B. +4, -8, +4, -8...)' },
      { id: '02', name: 'System 02', description: 'Zwei abwechselnde Operationen, die sich pro Schritt ändern' },
      { id: '03', name: 'System 03', description: 'Zwei Ebenen von Differenzen (geometrische Progression)' },
      { id: '04', name: 'System 04', description: 'Drei sich wiederholende Operationen (R1, R2, R3, R1, R2, R3...)' },
      { id: '05', name: 'System 05', description: 'Drei Operationen, die sich pro Zyklus ändern (R1, R2, R3, R1, R2, R3...)' },
      { id: '06', name: 'System 06', description: 'Fibonacci-Folge (jede Zahl ist Summe der beiden vorherigen)' },
      { id: '07', name: 'System 07', description: 'Fibonacci mit abwechselnden Additionen und Subtraktionen' },
      { id: '08', name: 'System 08', description: 'Tribonacci-Folge (jede Zahl ist Summe der drei vorherigen)' },
      { id: '09', name: 'System 09', description: 'Fibonacci-Variante: Z(n) = Z(n-1) + Z(n-3)' },
      { id: '10', name: 'System 10', description: 'Fibonacci im Rechenschritt (Differenzen bilden Fibonacci-Folge)' },
      { id: '11', name: 'System 11', description: 'Zwei verschachtelte Sequenzen (Zw1, Zw2, Zw1, Zw2...)' },
      { id: '12', name: 'System 12', description: 'Zwei verschachtelte Sequenzen, Zw1 ändert sich pro Zyklus' },
      { id: '13', name: 'System 13', description: '3er-Sprung: Operationen mit Sprung von 3 Positionen' },
      { id: '14', name: 'System 14', description: '3er-Sprung: Dr1 mit steigenden Werten (x, 2x, 3x, ...)' },
      { id: '15', name: 'System 15', description: '1er-Sprung (zwei Operationen nacheinander) oder 2er-Sprung (geometrische Progression)' },
      { id: '16', name: 'System 16', description: '1er-Sprung - 3 Ebenen (4. Differenz ist konstant)' },
      { id: '17', name: 'System 17', description: '1er-Sprung: Quersumme der letzten Zahl addiert/subtrahiert' },
      { id: '18', name: 'System 18', description: 'Fibonacci: Z2 + Z1 = Z3, mit Multiplikation für andere Positionen' },
      { id: '19', name: 'System 19', description: '1er-Sprung: Fibonacci und Quersumme abwechselnd' },
      { id: '20', name: 'System 20', description: '1er-Sprung: R1, Fibonacci (Z2 + Z1 = Z3), R2 abwechselnd' },
      { id: '21', name: 'System 21', description: '1er-Sprung: Fibonacci: R3 + R1 = R5' },
      { id: '22', name: 'System 22', description: '1er-Sprung: R1 + Fibonacci: Z3 + Z2 + Z1 = Z4' },
      { id: '23', name: 'System 23', description: '3er-Sprung: Fibonacci: Dr2 + Dr1 = Dr3' },
      { id: '24', name: 'System 24', description: 'Fibonacci: Z4 + Z3 + Z2 + Z1 = Z5' },
      { id: '25', name: 'System 25', description: '1er-Sprung: R1, R2, R3, R4 (vier sich wiederholende Operationen)' },
      { id: '26', name: 'System 26', description: 'Fibonacci: Z1 + Z3 = Z5 // Z2 + Z4 = Z6 // Z3 + Z5 = Z7' },
      { id: '28', name: 'System 28', description: '3er-Sprung: Dr1, Fibonacci (Z1 - Z2 = Z5), Dr3' },
      { id: '29', name: 'System 29', description: '1er-Sprung: R1 mit 0x, R2, R3, Fibonacci (Z3 - Z4 = Z5)' },
      { id: '30', name: 'System 30', description: '3er-Sprung: Dr1, Fibonacci (Z2 + Z3 = Z5), Dr1' },
      { id: '31', name: 'System 31', description: '3er-Sprung: Dr1, Dr1, Fibonacci (Z3 + Z4 = Z6)' }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
