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
import { selectSystemByProbability, systemProbabilities } from './systemProbabilities.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// System 01: Pattern -16, x2, -16, x2, -16, x2...
// Starting sequence: 34, 18, 36, 20, 40, 24, 48
// Next: 48 - 16 = 32, then 32 * 2 = 64

// Helper function to get generator function for a system
function getSystemGenerator(systemId) {
  const generators = {
    '01': generateSystem01Task,
    '02': generateSystem02Task,
    '03': generateSystem03Task,
    '04': generateSystem04Task,
    '05': generateSystem05Task,
    '06': generateSystem06Task,
    '07': generateSystem07Task,
    '08': generateSystem08Task,
    '09': generateSystem09Task,
    '10': generateSystem10Task,
    '11': generateSystem11Task,
    '12': generateSystem12Task,
    '13': generateSystem13Task,
    '14': generateSystem14Task,
    '15': generateSystem15Task,
    '16': generateSystem16Task,
    '17': generateSystem17Task,
    '18': generateSystem18Task,
    '19': generateSystem19Task,
    '20': generateSystem20Task,
    '21': generateSystem21Task,
    '22': generateSystem22Task,
    '23': generateSystem23Task,
    '24': generateSystem24Task,
    '25': generateSystem25Task,
    '26': generateSystem26Task,
    '28': generateSystem28Task,
    '29': generateSystem29Task,
    '30': generateSystem30Task,
    '31': generateSystem31Task,
  };
  return generators[systemId];
}

// Helper function to generate tasks for a single system
async function generateTasksForSystem(systemId, count) {
  const generator = getSystemGenerator(systemId);
  if (!generator) {
    throw new Error(`System ${systemId} not found`);
  }
  
  const tasks = [];
  for (let i = 0; i < count; i++) {
    try {
      let task;
      
      // System 03 has special validation, so we need to handle it differently
      if (systemId === '03') {
        let taskGenerated = false;
        let attempts = 0;
        
        while (!taskGenerated && attempts < 10) {
          try {
            task = generator();
            
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
                taskGenerated = true;
              }
            }
          } catch (error) {
            // Continue to next attempt
          }
          attempts++;
        }
        
        if (!taskGenerated) {
          console.error(`Failed to generate task ${i + 1} for system 03 after 10 attempts`);
          continue;
        }
      } else {
        task = generator();
      }
      
      if (task && task.sequence && task.correctAnswer && task.options) {
        tasks.push({ ...task, systemId }); // Add systemId to each task
      }
    } catch (error) {
      console.error(`Error generating task ${i + 1} for system ${systemId}:`, error);
      // Skip this task and continue
    }
  }
  return tasks;
}

// Shuffle array function
function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

app.post('/api/generate-pdf', async (req, res) => {
  try {
    const { system, systems, totalCount = 100 } = req.body;
    
    let tasks = [];
    
    // Support both old format (single system) and new format (multiple systems)
    const systemsToGenerate = systems || (system ? [system] : []);
    
    if (systemsToGenerate.length === 0) {
      return res.status(400).json({ error: 'No systems specified' });
    }
    
    // Generate totalCount tasks, distributed by probability
    for (let i = 0; i < totalCount; i++) {
      try {
        // Select a system based on probabilities
        const selectedSystemId = selectSystemByProbability(systemsToGenerate);
        
        // Generate one task for the selected system
        const systemTasks = await generateTasksForSystem(selectedSystemId, 1);
        if (systemTasks.length > 0) {
          tasks.push(systemTasks[0]);
        }
      } catch (error) {
        console.error(`Error generating task ${i + 1}:`, error);
        // Continue with next task
      }
    }
    
    // Shuffle tasks to mix them (optional, but ensures randomness)
    tasks = shuffleArray(tasks);
    
    if (tasks.length === 0) {
      return res.status(500).json({ error: 'Failed to generate any valid tasks' });
    }
    
    // Generate PDF with mixed systems
    const pdfBuffer = await generatePDF(tasks, systemsToGenerate.length > 1 ? 'gemischt' : systemsToGenerate[0]);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=medat-${systemsToGenerate.length > 1 ? 'gemischte-systeme' : `system-${systemsToGenerate[0]}`}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF: ' + error.message });
  }
});

app.get('/api/probabilities', (req, res) => {
  res.json({ probabilities: systemProbabilities });
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
