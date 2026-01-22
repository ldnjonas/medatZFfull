// System 29: 1er-Sprung: R1 mit 0x, R2, R3, Fibonacci (Z3 - Z4 = Z5)
// Pattern alternates between operations R1, R2, R3 and Fibonacci subtraction rule
// Example: 18, 25, 50, 42, 8, 16, 32
// Position 1 → 2: R1 (+7): 18 + 7 = 25
// Position 2 → 3: R2 (*2): 25 * 2 = 50
// Position 3 → 4: R3 (-8): 50 - 8 = 42
// Position 5: Fibonacci: Z3 - Z4 = Z5 (50 - 42 = 8) ✓
// Position 5 → 6: R1 (+8): 8 + 8 = 16
// Position 6 → 7: R2 (*2): 16 * 2 = 32

export function generateSystem29Task() {
  let attempts = 0;
  const maxAttempts = 20;
  
  while (attempts < maxAttempts) {
    try {
      const result = generateSequence();
      if (result && result.sequence && result.sequence.length === 7) {
        // Verify the Fibonacci rule Z3 - Z4 = Z5
        const z3 = result.sequence[2];
        const z4 = result.sequence[3];
        const z5 = result.sequence[4];
        
        if (z3 - z4 === z5) {
          return result;
        }
      }
    } catch (error) {
      // Continue to next attempt
    }
    attempts++;
  }
  
  // Fallback to safe pattern
  return generateSystem29Safe();
}

function generateSequence() {
  // Generate starting number
  const start = Math.floor(Math.random() * 30) + 10; // 10-39
  
  // Generate operations R1, R2, R3
  // R1: typically addition (can vary)
  const r1Value = Math.floor(Math.random() * 15) + 2; // 2-16
  const r1Op = { type: '+', value: r1Value };
  
  // R2: typically multiplication
  const r2Value = Math.floor(Math.random() * 4) + 2; // 2-5
  const r2Op = { type: '*', value: r2Value };
  
  // R3: typically subtraction
  const r3Value = Math.floor(Math.random() * 15) + 2; // 2-16
  const r3Op = { type: '-', value: r3Value };
  
  // Build sequence
  const sequence = [start];
  
  // Position 2: Position 1 + R1
  const pos2 = applyOperation(sequence[0], r1Op);
  if (!Number.isInteger(pos2) || pos2 <= 0 || pos2 > 100000 || isNaN(pos2) || !isFinite(pos2)) {
    throw new Error('Invalid position 2');
  }
  sequence.push(pos2);
  
  // Position 3: Position 2 + R2
  const pos3 = applyOperation(sequence[1], r2Op);
  if (!Number.isInteger(pos3) || pos3 <= 0 || pos3 > 100000 || isNaN(pos3) || !isFinite(pos3)) {
    throw new Error('Invalid position 3');
  }
  sequence.push(pos3);
  
  // Position 4: Position 3 + R3
  const pos4 = applyOperation(sequence[2], r3Op);
  if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
    throw new Error('Invalid position 4');
  }
  sequence.push(pos4);
  
  // Position 5: Fibonacci rule: Position 3 - Position 4
  const pos5 = sequence[2] - sequence[3];
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: Position 5 + R1
  const pos6 = applyOperation(sequence[4], r1Op);
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Position 7: Position 6 + R2
  const pos7 = applyOperation(sequence[5], r2Op);
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // Position 8: Position 7 + R3 (continuing the pattern: R1, R2, R3, Fibonacci, R1, R2, R3, Fibonacci)
  const pos8 = applyOperation(sequence[6], r3Op);
  
  // Ensure Position 7 > Position 8 so that Position 9 is positive
  if (sequence[6] <= pos8) {
    throw new Error('Position 7 must be greater than Position 8 for Fibonacci rule');
  }
  
  // Position 9: Fibonacci rule: Position 7 - Position 8 (same pattern as Z3 - Z4 = Z5)
  // This ensures the pattern repeats: Z7 - Z8 = Z9
  const pos9 = sequence[6] - pos8;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    throw new Error('Invalid answer values');
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, r1Op, r2Op, r3Op);
  
  // Create answer options
  const options = createAnswerOptionsPair(pos8, pos9, wrongAnswerPairs);
  
  return {
    sequence: sequence,
    correctAnswer: {
      position8: pos8,
      position9: pos9
    },
    options: options
  };
}

function applyOperation(value, operation) {
  switch (operation.type) {
    case '+':
      return value + operation.value;
    case '-':
      return Math.max(1, value - operation.value); // Ensure positive
    case '*':
      return value * operation.value;
    case '/':
      // Only divide if divisible - must be exact integer
      if (value % operation.value !== 0) {
        throw new Error(`Division ${value} / ${operation.value} is not an integer`);
      }
      return value / operation.value;
    default:
      return value;
  }
}

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, r1Op, r2Op, r3Op) {
  const wrongPairs = new Set();
  let attempts = 0;
  const maxAttempts = 200;
  
  while (wrongPairs.size < 4 && attempts < maxAttempts) {
    attempts++;
    const variation = Math.floor(Math.random() * 6);
    let wrongPos8, wrongPos9;
    
    try {
      switch (variation) {
        case 0:
          // Both positions slightly off
          wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          break;
        case 1:
          // First position correct, second wrong
          wrongPos8 = correctPos8;
          wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 15) + 5);
          break;
        case 2:
          // Use wrong operation for position 8 (e.g., R2 instead of R3)
          wrongPos8 = applyOperation(sequence[6], r2Op);
          wrongPos9 = applyOperation(wrongPos8, r1Op);
          break;
        case 3:
          // Use wrong operation for position 9 (e.g., R2 instead of R1)
          wrongPos8 = applyOperation(sequence[6], r3Op);
          wrongPos9 = applyOperation(wrongPos8, r2Op);
          break;
        case 4:
          // Use Fibonacci rule instead of R3 for position 8
          wrongPos8 = sequence[5] - sequence[6]; // Wrong: using Fibonacci instead of R3
          wrongPos9 = applyOperation(wrongPos8, r1Op);
          break;
        case 5:
          // Use wrong source position
          wrongPos8 = applyOperation(sequence[5], r3Op); // Wrong: using pos6 instead of pos7
          wrongPos9 = applyOperation(wrongPos8, r1Op);
          break;
      }
      
      wrongPos8 = Math.max(1, Math.round(wrongPos8));
      wrongPos9 = Math.max(1, Math.round(wrongPos9));
      
      const isTooSimilar = Math.abs(wrongPos8 - correctPos8) < 2 && Math.abs(wrongPos9 - correctPos9) < 4;
      
      if (wrongPos8 > 0 && wrongPos9 > 0 && 
          Number.isInteger(wrongPos8) && Number.isInteger(wrongPos9) &&
          !(wrongPos8 === correctPos8 && wrongPos9 === correctPos9) &&
          !isTooSimilar &&
          !isNaN(wrongPos8) && isFinite(wrongPos8) &&
          !isNaN(wrongPos9) && isFinite(wrongPos9)) {
        const pairKey = `${wrongPos8}/${wrongPos9}`;
        if (!wrongPairs.has(pairKey)) {
          wrongPairs.add(pairKey);
        }
      }
    } catch (error) {
      // Continue to next attempt
      continue;
    }
  }
  
  // If we don't have enough wrong pairs, generate simple variations
  while (wrongPairs.size < 4) {
    const offset8 = (wrongPairs.size + 1) * 5;
    const offset9 = (wrongPairs.size + 1) * 10;
    wrongPairs.add(`${correctPos8 + offset8}/${correctPos9 + offset9}`);
  }
  
  return Array.from(wrongPairs).slice(0, 4).map(pair => {
    const [pos8, pos9] = pair.split('/').map(Number);
    // Validate and ensure no NaN
    const validPos8 = (isNaN(pos8) || !isFinite(pos8)) ? correctPos8 + 10 : pos8;
    const validPos9 = (isNaN(pos9) || !isFinite(pos9)) ? correctPos9 + 20 : pos9;
    return { position8: Math.max(1, Math.round(validPos8)), position9: Math.max(1, Math.round(validPos9)) };
  });
}

function createAnswerOptionsPair(correctPos8, correctPos9, wrongPairs) {
  // Validate correct answers
  const validPos8 = Number.isInteger(correctPos8) && isFinite(correctPos8) ? correctPos8 : 0;
  const validPos9 = Number.isInteger(correctPos9) && isFinite(correctPos9) ? correctPos9 : 0;
  
  // Filter and validate wrong pairs
  const validWrongPairs = wrongPairs.filter(pair => {
    const pos8 = Number(pair.position8);
    const pos9 = Number(pair.position9);
    return Number.isInteger(pos8) && isFinite(pos8) && pos8 > 0 &&
           Number.isInteger(pos9) && isFinite(pos9) && pos9 > 0;
  });
  
  // Ensure we have at least 4 valid wrong pairs
  while (validWrongPairs.length < 4) {
    const offset8 = (validWrongPairs.length + 1) * 5;
    const offset9 = (validWrongPairs.length + 1) * 10;
    validWrongPairs.push({
      position8: validPos8 + offset8,
      position9: validPos9 + offset9
    });
  }
  
  const shuffled = [...validWrongPairs].sort(() => Math.random() - 0.5);
  const correctPosition = Math.floor(Math.random() * 4);
  const options = [];
  let wrongIndex = 0;
  
  for (let i = 0; i < 4; i++) {
    if (i === correctPosition) {
      options.push({
        label: String.fromCharCode(65 + i),
        position8: validPos8,
        position9: validPos9,
        isCorrect: true
      });
    } else {
      const wrongPair = shuffled[wrongIndex] || { position8: validPos8 + 10, position9: validPos9 + 20 };
      options.push({
        label: String.fromCharCode(65 + i),
        position8: Number(wrongPair.position8),
        position9: Number(wrongPair.position9)
      });
      wrongIndex++;
    }
  }
  
  options.push({
    label: 'E',
    position8: null,
    position9: null,
    isNone: true
  });
  
  return options;
}

function generateSystem29Safe() {
  // Safe fallback: use example values from the image
  // Sequence: 18, 25, 50, 42, 8, 16, 32
  // Position 1 → 2: R1 (+7): 18 + 7 = 25
  // Position 2 → 3: R2 (*2): 25 * 2 = 50
  // Position 3 → 4: R3 (-8): 50 - 8 = 42
  // Position 5: Fibonacci: Z3 - Z4 = Z5 (50 - 42 = 8) ✓
  // Position 5 → 6: R1 (+8): 8 + 8 = 16
  // Position 6 → 7: R2 (*2): 16 * 2 = 32
  
  const sequence = [18, 25, 50, 42, 8, 16, 32];
  const r1Op = { type: '+', value: 8 }; // R1: +8 (for position 5→6, but was +7 for 1→2, so R1 can vary)
  const r2Op = { type: '*', value: 2 }; // R2: *2
  const r3Op = { type: '-', value: 8 }; // R3: -8
  
  // Position 8: Position 7 + R3
  const pos8 = applyOperation(sequence[6], r3Op); // 32 - 8 = 24
  
  // Position 9: Fibonacci rule: Position 7 - Position 8
  const pos9 = sequence[6] - pos8; // 32 - 24 = 8
  
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, r1Op, r2Op, r3Op);
  const options = createAnswerOptionsPair(pos8, pos9, wrongAnswerPairs);
  
  return {
    sequence: sequence,
    correctAnswer: {
      position8: pos8,
      position9: pos9
    },
    options: options
  };
}
