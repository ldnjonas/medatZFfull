// System 25: Four repeating operations (R1, R2, R3, R4, R1, R2, R3, R4, ...)
// Operations can be: +n, -n, *n, /n (where n is a positive integer)
// All results must be positive whole numbers
// Example: 10, 6, 12, 14, 7, 3, 6
// Pattern: -4, *2, +2, /2, -4, *2
// (Symmetry recognizable by the parallel rhythm of -4 +2 -4 and *2 /2 *2)

export function generateSystem25Task() {
  let attempts = 0;
  const maxAttempts = 20;
  
  while (attempts < maxAttempts) {
    try {
      // Generate four random operations
      const { op1, op2, op3, op4 } = generateRandomOperations();
      
      // Generate a starting number that ensures all results are positive integers
      const startNumber = generateValidStartNumber(op1, op2, op3, op4);
      
      // Build the sequence of 7 numbers
      const sequence = [startNumber];
      let current = startNumber;
      
      for (let i = 0; i < 6; i++) {
        const operationIndex = i % 4;
        let operation;
        
        if (operationIndex === 0) {
          operation = op1; // R1
        } else if (operationIndex === 1) {
          operation = op2; // R2
        } else if (operationIndex === 2) {
          operation = op3; // R3
        } else {
          operation = op4; // R4
        }
        
        // Check if division will be exact before applying
        if (operation.type === '/' && current % operation.value !== 0) {
          throw new Error('Division not exact');
        }
        
        current = applyOperation(current, operation);
        
        if (!Number.isInteger(current) || current <= 0 || current > 100000 || isNaN(current) || !isFinite(current)) {
          throw new Error('Invalid sequence value');
        }
        
        sequence.push(current);
      }
      
      // Calculate correct answers for positions 8 and 9
      // Position 8: after position 7, apply R3 (index 6 % 4 = 2)
      if (op3.type === '/' && current % op3.value !== 0) {
        throw new Error('Position 8 division not exact');
      }
      const pos8 = applyOperation(current, op3);
      
      // Position 9: after position 8, apply R4 (index 7 % 4 = 3)
      if (op4.type === '/' && pos8 % op4.value !== 0) {
        throw new Error('Position 9 division not exact');
      }
      const pos9 = applyOperation(pos8, op4);
      
      // Final validation
      if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
          !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
        throw new Error('Invalid answer values');
      }
      
      // Generate wrong answer pairs
      const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, op1, op2, op3, op4);
      
      // Create answer options as pairs
      const options = createAnswerOptionsPair(pos8, pos9, wrongAnswerPairs);
      
      return {
        sequence: sequence,
        correctAnswer: {
          position8: pos8,
          position9: pos9
        },
        options: options
      };
    } catch (error) {
      // Continue to next attempt
    }
    attempts++;
  }
  
  // Fallback to safe pattern
  return generateSystem25Safe();
}

function generateRandomOperations() {
  const operations = ['+', '-', '*', '/'];
  
  // Randomly select four operations (can be the same or different)
  const op1Type = operations[Math.floor(Math.random() * operations.length)];
  const op2Type = operations[Math.floor(Math.random() * operations.length)];
  const op3Type = operations[Math.floor(Math.random() * operations.length)];
  const op4Type = operations[Math.floor(Math.random() * operations.length)];
  
  // Generate values for operations
  let op1, op2, op3, op4;
  
  // Operation 1
  if (op1Type === '+' || op1Type === '-') {
    op1 = { type: op1Type, value: Math.floor(Math.random() * 20) + 2 }; // 2-21
  } else if (op1Type === '*') {
    op1 = { type: op1Type, value: Math.floor(Math.random() * 4) + 2 }; // 2-5
  } else { // division
    op1 = { type: op1Type, value: Math.floor(Math.random() * 3) + 2 }; // 2-4
  }
  
  // Operation 2
  if (op2Type === '+' || op2Type === '-') {
    op2 = { type: op2Type, value: Math.floor(Math.random() * 20) + 2 }; // 2-21
  } else if (op2Type === '*') {
    op2 = { type: op2Type, value: Math.floor(Math.random() * 4) + 2 }; // 2-5
  } else { // division
    op2 = { type: op2Type, value: Math.floor(Math.random() * 3) + 2 }; // 2-4
  }
  
  // Operation 3
  if (op3Type === '+' || op3Type === '-') {
    op3 = { type: op3Type, value: Math.floor(Math.random() * 20) + 2 }; // 2-21
  } else if (op3Type === '*') {
    op3 = { type: op3Type, value: Math.floor(Math.random() * 4) + 2 }; // 2-5
  } else { // division
    op3 = { type: op3Type, value: Math.floor(Math.random() * 3) + 2 }; // 2-4
  }
  
  // Operation 4
  if (op4Type === '+' || op4Type === '-') {
    op4 = { type: op4Type, value: Math.floor(Math.random() * 20) + 2 }; // 2-21
  } else if (op4Type === '*') {
    op4 = { type: op4Type, value: Math.floor(Math.random() * 4) + 2 }; // 2-5
  } else { // division
    op4 = { type: op4Type, value: Math.floor(Math.random() * 3) + 2 }; // 2-4
  }
  
  return { op1, op2, op3, op4 };
}

function generateValidStartNumber(op1, op2, op3, op4) {
  // Try to find a valid starting number that ensures all 9 positions are positive integers
  // For division operations, we need to ensure the starting number is a multiple of all divisors
  let startNumber;
  let valid = false;
  let attempts = 0;
  
  // Collect all divisors
  const divisors = [];
  if (op1.type === '/') divisors.push(op1.value);
  if (op2.type === '/') divisors.push(op2.value);
  if (op3.type === '/') divisors.push(op3.value);
  if (op4.type === '/') divisors.push(op4.value);
  
  // Calculate LCM (Least Common Multiple) of divisors to ensure divisibility
  const lcm = divisors.length > 0 ? divisors.reduce((a, b) => {
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
    return (a * b) / gcd(a, b);
  }) : 1;
  
  while (!valid && attempts < 500) {
    // Start with a reasonable number (adjust based on operation types)
    if (op1.type === '*' || op2.type === '*' || op3.type === '*' || op4.type === '*') {
      startNumber = Math.floor(Math.random() * 30) + 10; // 10-39 for multiplication
    } else if (op1.type === '/' || op2.type === '/' || op3.type === '/' || op4.type === '/') {
      // For division, start with a multiple of LCM
      const multiplier = Math.floor(Math.random() * 20) + 5; // 5-24
      startNumber = lcm * multiplier;
    } else {
      startNumber = Math.floor(Math.random() * 60) + 20; // 20-79 for addition/subtraction
    }
    
    // Test if this starting number produces valid sequence
    let current = startNumber;
    valid = true;
    
    try {
      for (let i = 0; i < 8; i++) { // 7 given + position 8
        const operationIndex = i % 4;
        let operation;
        
        if (operationIndex === 0) {
          operation = op1;
        } else if (operationIndex === 1) {
          operation = op2;
        } else if (operationIndex === 2) {
          operation = op3;
        } else {
          operation = op4;
        }
        
        // Check if division will be exact before applying
        if (operation.type === '/' && current % operation.value !== 0) {
          valid = false;
          break;
        }
        
        current = applyOperation(current, operation);
        
        if (current <= 0 || !Number.isInteger(current) || isNaN(current) || !isFinite(current)) {
          valid = false;
          break;
        }
      }
      
      // Also check position 9
      if (valid) {
        // Check if division will be exact before applying
        if (op4.type === '/' && current % op4.value !== 0) {
          valid = false;
        } else {
          const pos9 = applyOperation(current, op4); // After position 8, apply R4
          
          if (pos9 <= 0 || !Number.isInteger(pos9) || isNaN(pos9) || !isFinite(pos9)) {
            valid = false;
          }
        }
      }
    } catch (error) {
      valid = false;
    }
    
    attempts++;
  }
  
  // If we couldn't find a valid number, use a safe default
  if (!valid) {
    if (op1.type === '*' || op2.type === '*' || op3.type === '*' || op4.type === '*') {
      startNumber = Math.floor(Math.random() * 20) + 20; // 20-39
    } else if (op1.type === '/' || op2.type === '/' || op3.type === '/' || op4.type === '/') {
      // Use a multiple of LCM
      startNumber = lcm * 10;
    } else {
      startNumber = Math.floor(Math.random() * 40) + 60; // 60-99
    }
  }
  
  return startNumber;
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, op1, op2, op3, op4) {
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
          // First position wrong, second follows pattern from wrong first
          wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          wrongPos9 = applyOperation(wrongPos8, op4); // Apply op4 to wrong pos8
          break;
        case 3:
          // Use wrong operation for position 8 (e.g., op4 instead of op3)
          wrongPos8 = applyOperation(sequence[6], op4);
          wrongPos9 = applyOperation(wrongPos8, op4);
          break;
        case 4:
          // Use wrong operation for position 9 (e.g., op1 instead of op4)
          wrongPos8 = applyOperation(sequence[6], op3);
          wrongPos9 = applyOperation(wrongPos8, op1);
          break;
        case 5:
          // Use sequence values with variations
          const seqValue = sequence[Math.floor(Math.random() * sequence.length)];
          wrongPos8 = seqValue + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 8) + 2);
          wrongPos9 = wrongPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 15) + 5);
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
    return { position8: pos8, position9: pos9 };
  });
}

function createAnswerOptionsPair(correctPos8, correctPos9, wrongPairs) {
  // Shuffle wrong pairs
  const shuffled = [...wrongPairs].sort(() => Math.random() - 0.5);
  
  // Randomly choose position for correct answer (A-D)
  const correctPosition = Math.floor(Math.random() * 4);
  
  // Create options A-D
  const options = [];
  let wrongIndex = 0;
  
  for (let i = 0; i < 4; i++) {
    if (i === correctPosition) {
      options.push({
        label: String.fromCharCode(65 + i),
        position8: correctPos8,
        position9: correctPos9,
        isCorrect: true
      });
    } else {
      options.push({
        label: String.fromCharCode(65 + i),
        position8: shuffled[wrongIndex].position8,
        position9: shuffled[wrongIndex].position9
      });
      wrongIndex++;
    }
  }
  
  // Add option E: "none of the above"
  options.push({
    label: 'E',
    position8: null,
    position9: null,
    isNone: true
  });
  
  return options;
}

function generateSystem25Safe() {
  // Safe fallback: use example values from the image
  // Sequence: 10, 6, 12, 14, 7, 3, 6
  // Pattern: -4, *2, +2, /2, -4, *2
  
  const sequence = [10, 6, 12, 14, 7, 3, 6];
  const op3 = { type: '+', value: 2 }; // R3: +2 (but actually position 8 should use R3, which is +2)
  const op4 = { type: '/', value: 2 }; // R4: /2
  
  // Actually, let me recalculate based on the pattern
  // Position 1 → 2: -4 (R1)
  // Position 2 → 3: *2 (R2)
  // Position 3 → 4: +2 (R3)
  // Position 4 → 5: /2 (R4)
  // Position 5 → 6: -4 (R1)
  // Position 6 → 7: *2 (R2)
  // Position 7 → 8: +2 (R3)
  // Position 8 → 9: /2 (R4)
  
  const op1 = { type: '-', value: 4 };
  const op2 = { type: '*', value: 2 };
  const op3Safe = { type: '+', value: 2 };
  const op4Safe = { type: '/', value: 2 };
  
  // Position 8: Position 7 + R3 (+2)
  const pos8 = sequence[6] + op3Safe.value; // 6 + 2 = 8
  
  // Position 9: Position 8 / R4 (/2)
  const pos9 = pos8 / op4Safe.value; // 8 / 2 = 4
  
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, op1, op2, op3Safe, op4Safe);
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
