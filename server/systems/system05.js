// System 05: Three operations that change with each cycle
// R1, R2, R3, R1, R2, R3, ... (repeating pattern)
// Each operation changes by an increment per cycle
// Example: 21, 29, 15, 30, 39, 26, 78
// R1: +8, +9, ... (increment +1)
// R2: -14, -13, ... (increment +1)
// R3: x2, x3, ... (increment +1)

import { MAX_POSITION_VALUE } from '../config.js';

export function generateSystem05Task() {
  // Generate three random operations with their changing values
  const { r1Op, r2Op, r3Op } = generateRandomOperationTypes();
  
  // Generate parameters for R1, R2, R3 operations
  const r1Params = generateOperationParams(r1Op.type);
  const r2Params = generateOperationParams(r2Op.type);
  const r3Params = generateOperationParams(r3Op.type);
  
  // Generate a starting number that ensures all results are positive integers
  const startNumber = generateValidStartNumber(r1Op, r1Params, r2Op, r2Params, r3Op, r3Params);
  
  // Build the sequence of 7 numbers
  const sequence = [startNumber];
  let current = startNumber;
  
  for (let i = 0; i < 6; i++) {
    const cycle = Math.floor(i / 3); // Which cycle (0 or 1 for first 6 steps)
    const operationIndex = i % 3; // Which operation in cycle (0=R1, 1=R2, 2=R3)
    
    let operation, opValue;
    
    if (operationIndex === 0) {
      // R1
      opValue = r1Params.initial + cycle * r1Params.increment;
      operation = { type: r1Op.type, value: opValue };
    } else if (operationIndex === 1) {
      // R2
      opValue = r2Params.initial + cycle * r2Params.increment;
      operation = { type: r2Op.type, value: opValue };
    } else {
      // R3
      opValue = r3Params.initial + cycle * r3Params.increment;
      operation = { type: r3Op.type, value: opValue };
    }
    
    current = applyOperation(current, operation);
    sequence.push(current);
  }
  
  // Calculate correct answers for positions 8 and 9
  // Position 8: after position 7, apply R1_2 (cycle 2)
  const cycle2 = 2;
  const r1Value2 = r1Params.initial + cycle2 * r1Params.increment;
  const pos8 = applyOperation(current, { type: r1Op.type, value: r1Value2 });
  
  // Position 9: after position 8, apply R2_2 (cycle 2)
  const r2Value2 = r2Params.initial + cycle2 * r2Params.increment;
  const pos9 = applyOperation(pos8, { type: r2Op.type, value: r2Value2 });
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > MAX_POSITION_VALUE || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > MAX_POSITION_VALUE || isNaN(pos9) || !isFinite(pos9)) {
    // Retry if invalid
    return generateSystem05Task();
  }
  
  // Validate sequence
  const invalidSequence = sequence.some(num => 
    !Number.isInteger(num) || num <= 0 || num > 100000 || isNaN(num) || !isFinite(num)
  );
  
  if (invalidSequence) {
    return generateSystem05Task();
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(
    pos8, 
    pos9, 
    sequence, 
    r1Op,
    r1Params,
    r2Op,
    r2Params,
    r3Op,
    r3Params
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
  
  // Randomly select three operation types (can be the same or different)
  const r1Type = operations[Math.floor(Math.random() * operations.length)];
  const r2Type = operations[Math.floor(Math.random() * operations.length)];
  const r3Type = operations[Math.floor(Math.random() * operations.length)];
  
  return {
    r1Op: { type: r1Type },
    r2Op: { type: r2Type },
    r3Op: { type: r3Type }
  };
}

function generateOperationParams(operationType) {
  let initial, increment;
  
  switch (operationType) {
    case '+':
      // Addition: initial value 2-20, increment 1-5
      initial = Math.floor(Math.random() * 19) + 2; // 2-20
      increment = Math.floor(Math.random() * 5) + 1; // 1-5
      break;
    case '-':
      // Subtraction: initial value 2-20, increment 1-5
      initial = Math.floor(Math.random() * 19) + 2; // 2-20
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

function generateValidStartNumber(r1Op, r1Params, r2Op, r2Params, r3Op, r3Params) {
  // Try to find a valid starting number that ensures all 9 positions are positive integers
  let startNumber;
  let valid = false;
  let attempts = 0;
  
  // Collect divisors
  const divisors = [];
  if (r1Op.type === '/') divisors.push(r1Params.initial, r1Params.initial + r1Params.increment, r1Params.initial + 2 * r1Params.increment);
  if (r2Op.type === '/') divisors.push(r2Params.initial, r2Params.initial + r2Params.increment, r2Params.initial + 2 * r2Params.increment);
  if (r3Op.type === '/') divisors.push(r3Params.initial, r3Params.initial + r3Params.increment, r3Params.initial + 2 * r3Params.increment);
  
  // Calculate LCM of all divisors
  const uniqueDivisors = [...new Set(divisors)];
  const lcm = uniqueDivisors.length > 0 ? uniqueDivisors.reduce((a, b) => {
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
    return (a * b) / gcd(a, b);
  }) : 1;
  
  while (!valid && attempts < 500) {
    // Start with a reasonable number
    if (divisors.length > 0) {
      const multiplier = Math.floor(Math.random() * 20) + 5;
      startNumber = lcm * multiplier;
    } else if (r1Op.type === '*' || r2Op.type === '*' || r3Op.type === '*') {
      startNumber = Math.floor(Math.random() * 30) + 10; // 10-39
    } else {
      startNumber = Math.floor(Math.random() * 60) + 20; // 20-79
    }
    
    // Test if this starting number produces valid sequence
    let current = startNumber;
    valid = true;
    
    try {
      for (let i = 0; i < 8; i++) { // 7 given + position 8
        const cycle = Math.floor(i / 3);
        const operationIndex = i % 3;
        
        let operation, opValue;
        
        if (operationIndex === 0) {
          opValue = r1Params.initial + cycle * r1Params.increment;
          operation = { type: r1Op.type, value: opValue };
        } else if (operationIndex === 1) {
          opValue = r2Params.initial + cycle * r2Params.increment;
          operation = { type: r2Op.type, value: opValue };
        } else {
          opValue = r3Params.initial + cycle * r3Params.increment;
          operation = { type: r3Op.type, value: opValue };
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
        const cycle2 = 2;
        const r1Value2 = r1Params.initial + cycle2 * r1Params.increment;
        
        if (r1Op.type === '/' && current % r1Value2 !== 0) {
          valid = false;
        } else {
          const pos8 = applyOperation(current, { type: r1Op.type, value: r1Value2 });
          
          if (pos8 <= 0 || !Number.isInteger(pos8) || isNaN(pos8) || !isFinite(pos8)) {
            valid = false;
          } else {
            const r2Value2 = r2Params.initial + cycle2 * r2Params.increment;
            
            if (r2Op.type === '/' && pos8 % r2Value2 !== 0) {
              valid = false;
            } else {
              const pos9 = applyOperation(pos8, { type: r2Op.type, value: r2Value2 });
              
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
  
  // If we couldn't find a valid number, use a safe default
  if (!valid) {
    if (divisors.length > 0) {
      startNumber = lcm * 10;
    } else if (r1Op.type === '*' || r2Op.type === '*' || r3Op.type === '*') {
      startNumber = Math.floor(Math.random() * 20) + 20; // 20-39
    } else {
      startNumber = Math.floor(Math.random() * 40) + 60; // 60-99
    }
  }
  
  return startNumber;
}

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, r1Op, r1Params, r2Op, r2Params, r3Op, r3Params) {
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
        const r2Value2 = r2Params.initial + 2 * r2Params.increment;
        wrongPos9 = applyOperation(wrongPos8, { type: r2Op.type, value: r2Value2 });
        break;
      case 3:
        // Use wrong cycle for position 8 (e.g., cycle 1 instead of cycle 2)
        const r1Value1 = r1Params.initial + 1 * r1Params.increment;
        wrongPos8 = applyOperation(sequence[6], { type: r1Op.type, value: r1Value1 });
        const r2Value2Wrong = r2Params.initial + 2 * r2Params.increment;
        wrongPos9 = applyOperation(wrongPos8, { type: r2Op.type, value: r2Value2Wrong });
        break;
      case 4:
        // Use wrong cycle for position 9 (e.g., cycle 1 instead of cycle 2)
        const r1Value2Correct = r1Params.initial + 2 * r1Params.increment;
        wrongPos8 = applyOperation(sequence[6], { type: r1Op.type, value: r1Value2Correct });
        const r2Value1 = r2Params.initial + 1 * r2Params.increment;
        wrongPos9 = applyOperation(wrongPos8, { type: r2Op.type, value: r2Value1 });
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
