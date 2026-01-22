// System 02: Two alternating operations that change with each step
// R1 and R2 can be any operation type: +, -, *, /
// The values for these operations change with each step
// Example: R1 = +4, +10, +16, ... (addition with increasing value)
//          R2 = -11, -12, -13, ... (subtraction with decreasing value)
// Or:      R1 = *2, *3, *4, ... (multiplication with increasing multiplier)
//          R2 = /2, /3, /4, ... (division with increasing divisor)
// Pattern: R1_0, R2_0, R1_1, R2_1, R1_2, R2_2, ...

export function generateSystem02Task() {
  // Generate random operation types and their changing values
  const { r1Op, r2Op } = generateRandomOperationTypes();
  
  // Generate parameters for R1 and R2 operations
  const r1Params = generateOperationParams(r1Op.type);
  const r2Params = generateOperationParams(r2Op.type);
  
  // Generate a starting number that ensures all results are positive integers
  const startNumber = generateValidStartNumber(r1Op, r1Params, r2Op, r2Params);
  
  // Build the sequence of 7 numbers
  const sequence = [startNumber];
  let current = startNumber;
  
  for (let i = 0; i < 6; i++) {
    if (i % 2 === 0) {
      // Apply R1 at step i/2
      const r1Step = i / 2;
      const r1Value = r1Params.initial + r1Step * r1Params.increment;
      current = applyOperation(current, { type: r1Op.type, value: r1Value });
    } else {
      // Apply R2 at step (i-1)/2
      const r2Step = (i - 1) / 2;
      const r2Value = r2Params.initial + r2Step * r2Params.increment;
      current = applyOperation(current, { type: r2Op.type, value: r2Value });
    }
    sequence.push(current);
  }
  
  // Calculate correct answers for positions 8 and 9
  // Position 8: after position 7, apply R1_3
  const r1Step3 = 3;
  const r1Value3 = r1Params.initial + r1Step3 * r1Params.increment;
  const pos8 = applyOperation(current, { type: r1Op.type, value: r1Value3 });
  
  // Position 9: after position 8, apply R2_3
  const r2Step3 = 3;
  const r2Value3 = r2Params.initial + r2Step3 * r2Params.increment;
  const pos9 = applyOperation(pos8, { type: r2Op.type, value: r2Value3 });
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(
    pos8, 
    pos9, 
    sequence, 
    r1Op,
    r1Params,
    r2Op,
    r2Params
  );
  
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

function generateRandomOperationTypes() {
  const operations = ['+', '-', '*', '/'];
  
  // Randomly select two operation types (can be the same or different)
  const r1Type = operations[Math.floor(Math.random() * operations.length)];
  const r2Type = operations[Math.floor(Math.random() * operations.length)];
  
  return {
    r1Op: { type: r1Type },
    r2Op: { type: r2Type }
  };
}

function generateOperationParams(operationType) {
  let initial, increment;
  
  switch (operationType) {
    case '+':
      // Addition: initial value 2-10, increment 2-8
      initial = Math.floor(Math.random() * 9) + 2; // 2-10
      increment = Math.floor(Math.random() * 7) + 2; // 2-8
      break;
    case '-':
      // Subtraction: initial value 2-15, increment 1-5
      initial = Math.floor(Math.random() * 14) + 2; // 2-15
      increment = Math.floor(Math.random() * 5) + 1; // 1-5
      break;
    case '*':
      // Multiplication: initial multiplier 2-4, increment 1-2
      initial = Math.floor(Math.random() * 3) + 2; // 2-4
      increment = Math.floor(Math.random() * 2) + 1; // 1-2
      break;
    case '/':
      // Division: initial divisor 2-4, increment 1-2
      initial = Math.floor(Math.random() * 3) + 2; // 2-4
      increment = Math.floor(Math.random() * 2) + 1; // 1-2
      break;
  }
  
  return { initial, increment };
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

function generateValidStartNumber(r1Op, r1Params, r2Op, r2Params) {
  // Try to find a valid starting number that ensures all 9 positions are positive integers
  let startNumber;
  let valid = false;
  let attempts = 0;
  
  while (!valid && attempts < 500) {
    // Start with a reasonable number (adjust based on operation types)
    if (r1Op.type === '*' || r2Op.type === '*') {
      startNumber = Math.floor(Math.random() * 30) + 10; // 10-39 for multiplication
    } else if (r1Op.type === '/' || r2Op.type === '/') {
      startNumber = Math.floor(Math.random() * 100) + 50; // 50-149 for division
    } else {
      startNumber = Math.floor(Math.random() * 60) + 20; // 20-79 for addition/subtraction
    }
    
    // Test if this starting number produces valid sequence
    let current = startNumber;
    valid = true;
    
    try {
      for (let i = 0; i < 8; i++) { // 7 given + position 8
        let operation, opValue;
        
        if (i % 2 === 0) {
          // Apply R1
          const r1Step = i / 2;
          opValue = r1Params.initial + r1Step * r1Params.increment;
          operation = { type: r1Op.type, value: opValue };
        } else {
          // Apply R2
          const r2Step = (i - 1) / 2;
          opValue = r2Params.initial + r2Step * r2Params.increment;
          operation = { type: r2Op.type, value: opValue };
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
        const r1Step3 = 3;
        const r1Value3 = r1Params.initial + r1Step3 * r1Params.increment;
        
        if (r1Op.type === '/' && current % r1Value3 !== 0) {
          valid = false;
        } else {
          const pos8 = applyOperation(current, { type: r1Op.type, value: r1Value3 });
          
          if (pos8 <= 0 || !Number.isInteger(pos8) || isNaN(pos8) || !isFinite(pos8)) {
            valid = false;
          } else {
            const r2Step3 = 3;
            const r2Value3 = r2Params.initial + r2Step3 * r2Params.increment;
            
            if (r2Op.type === '/' && pos8 % r2Value3 !== 0) {
              valid = false;
            } else {
              const pos9 = applyOperation(pos8, { type: r2Op.type, value: r2Value3 });
              
              if (pos9 <= 0 || !Number.isInteger(pos9) || isNaN(pos9) || !isFinite(pos9)) {
                valid = false;
              }
            }
          }
        }
      }
    } catch (error) {
      valid = false;
    }
    
    attempts++;
  }
  
  // If we couldn't find a valid number, use a larger safe default
  if (!valid) {
    if (r1Op.type === '*' || r2Op.type === '*') {
      startNumber = Math.floor(Math.random() * 20) + 20; // 20-39
    } else if (r1Op.type === '/' || r2Op.type === '/') {
      startNumber = Math.floor(Math.random() * 50) + 100; // 100-149
    } else {
      startNumber = Math.floor(Math.random() * 40) + 60; // 60-99
    }
  }
  
  return startNumber;
}

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, r1Op, r1Params, r2Op, r2Params) {
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
        // Apply R2_3 to wrong pos8
        const r2Value3 = r2Params.initial + 3 * r2Params.increment;
        wrongPos9 = applyOperation(wrongPos8, { type: r2Op.type, value: r2Value3 });
        break;
      case 3:
        // Use wrong R1 step (e.g., R1_2 instead of R1_3)
        const r1Value2 = r1Params.initial + 2 * r1Params.increment;
        wrongPos8 = applyOperation(sequence[6], { type: r1Op.type, value: r1Value2 });
        const r2Value3Wrong = r2Params.initial + 3 * r2Params.increment;
        wrongPos9 = applyOperation(wrongPos8, { type: r2Op.type, value: r2Value3Wrong });
        break;
      case 4:
        // Use wrong R2 step (e.g., R2_2 instead of R2_3)
        const r1Value3Correct = r1Params.initial + 3 * r1Params.increment;
        wrongPos8 = applyOperation(sequence[6], { type: r1Op.type, value: r1Value3Correct });
        const r2Value2 = r2Params.initial + 2 * r2Params.increment;
        wrongPos9 = applyOperation(wrongPos8, { type: r2Op.type, value: r2Value2 });
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
