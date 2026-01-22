// System 04: Three repeating operations (R1, R2, R3, R1, R2, R3, ...)
// Operations can be: +n, -n, *n, /n (where n is a positive integer)
// All results must be positive whole numbers
// Example: 32, 16, 64, 80, 40, 160, 176
// Pattern: /2, x4, +16, /2, x4, +16

export function generateSystem04Task() {
  // Generate three random operations
  const { op1, op2, op3 } = generateRandomOperations();
  
  // Generate a starting number that ensures all results are positive integers
  const startNumber = generateValidStartNumber(op1, op2, op3);
  
  // Build the sequence of 7 numbers
  const sequence = [startNumber];
  let current = startNumber;
  
  for (let i = 0; i < 6; i++) {
    const operationIndex = i % 3;
    if (operationIndex === 0) {
      // Apply operation 1 (R1)
      current = applyOperation(current, op1);
    } else if (operationIndex === 1) {
      // Apply operation 2 (R2)
      current = applyOperation(current, op2);
    } else {
      // Apply operation 3 (R3)
      current = applyOperation(current, op3);
    }
    sequence.push(current);
  }
  
  // Calculate correct answers for positions 8 and 9
  // Position 8: after position 7, apply R1 (index 6 % 3 = 0)
  const pos8 = applyOperation(current, op1);
  
  // Position 9: after position 8, apply R2 (index 7 % 3 = 1)
  const pos9 = applyOperation(pos8, op2);
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    // Retry if invalid
    return generateSystem04Task();
  }
  
  // Validate sequence
  const invalidSequence = sequence.some(num => 
    !Number.isInteger(num) || num <= 0 || num > 100000 || isNaN(num) || !isFinite(num)
  );
  
  if (invalidSequence) {
    return generateSystem04Task();
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, op1, op2, op3);
  
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
}

function generateRandomOperations() {
  const operations = ['+', '-', '*', '/'];
  
  // Randomly select three operations (can be the same or different)
  const op1Type = operations[Math.floor(Math.random() * operations.length)];
  const op2Type = operations[Math.floor(Math.random() * operations.length)];
  const op3Type = operations[Math.floor(Math.random() * operations.length)];
  
  // Generate values for operations
  let op1, op2, op3;
  
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
  
  return { op1, op2, op3 };
}

function generateValidStartNumber(op1, op2, op3) {
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
  
  // Calculate LCM (Least Common Multiple) of divisors to ensure divisibility
  const lcm = divisors.length > 0 ? divisors.reduce((a, b) => {
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
    return (a * b) / gcd(a, b);
  }) : 1;
  
  while (!valid && attempts < 500) {
    // Start with a reasonable number (adjust based on operation types)
    if (op1.type === '*' || op2.type === '*' || op3.type === '*') {
      startNumber = Math.floor(Math.random() * 30) + 10; // 10-39 for multiplication
    } else if (op1.type === '/' || op2.type === '/' || op3.type === '/') {
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
        const operationIndex = i % 3;
        let operation;
        
        if (operationIndex === 0) {
          operation = op1;
        } else if (operationIndex === 1) {
          operation = op2;
        } else {
          operation = op3;
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
        if (op2.type === '/' && current % op2.value !== 0) {
          valid = false;
        } else {
          const pos9 = applyOperation(current, op2); // After position 8, apply R2
          
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
    if (op1.type === '*' || op2.type === '*' || op3.type === '*') {
      startNumber = Math.floor(Math.random() * 20) + 20; // 20-39
    } else if (op1.type === '/' || op2.type === '/' || op3.type === '/') {
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, op1, op2, op3) {
  const wrongPairs = new Set();
  
  // Generate 4 wrong answer pairs
  while (wrongPairs.size < 4) {
    const variation = Math.floor(Math.random() * 6);
    let wrongPos8, wrongPos9;
    
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
        wrongPos9 = applyOperation(wrongPos8, op2); // Apply op2 to wrong pos8
        break;
      case 3:
        // Use wrong operation for position 8 (e.g., op2 instead of op1)
        wrongPos8 = applyOperation(sequence[6], op2);
        wrongPos9 = applyOperation(wrongPos8, op2);
        break;
      case 4:
        // Use wrong operation for position 9 (e.g., op3 instead of op2)
        wrongPos8 = applyOperation(sequence[6], op1);
        wrongPos9 = applyOperation(wrongPos8, op3);
        break;
      case 5:
        // Use sequence values with variations
        const seqValue = sequence[Math.floor(Math.random() * sequence.length)];
        wrongPos8 = seqValue + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 8) + 2);
        wrongPos9 = wrongPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 15) + 5);
        break;
    }
    
    // Ensure positive integer values, not the correct pair, and not too similar
    wrongPos8 = Math.max(1, Math.round(wrongPos8));
    wrongPos9 = Math.max(1, Math.round(wrongPos9));
    
    const isTooSimilar = Math.abs(wrongPos8 - correctPos8) < 2 && Math.abs(wrongPos9 - correctPos9) < 4;
    
    if (wrongPos8 > 0 && wrongPos9 > 0 && 
        Number.isInteger(wrongPos8) && Number.isInteger(wrongPos9) &&
        !(wrongPos8 === correctPos8 && wrongPos9 === correctPos9) &&
        !isTooSimilar) {
      const pairKey = `${wrongPos8}/${wrongPos9}`;
      if (!wrongPairs.has(pairKey)) {
        wrongPairs.add(pairKey);
      }
    }
  }
  
  // Convert to array of objects
  return Array.from(wrongPairs).map(pair => {
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
