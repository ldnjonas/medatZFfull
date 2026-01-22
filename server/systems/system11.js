// System 11: Two interleaved sequences (Zw1, Zw2, Zw1, Zw2, ...)
// "2er-Sprung": Two-step jump pattern
// Example: 38, 10, 45, 20, 52, 40, 59
// Zw1 (positions 1, 3, 5, 7): 38, 45, 52, 59 with operation R1 (e.g., +7)
// Zw2 (positions 2, 4, 6): 10, 20, 40 with operation R2 (e.g., x2)

import { MAX_POSITION_VALUE } from '../config.js';

export function generateSystem11Task() {
  // Generate two random operations
  const { op1, op2 } = generateRandomOperations();
  
  // Generate starting numbers for both sequences
  const startZw1 = Math.floor(Math.random() * 40) + 10; // 10-49
  const startZw2 = Math.floor(Math.random() * 30) + 5; // 5-34
  
  // Generate valid starting numbers
  const validParams = generateValidParams(startZw1, startZw2, op1, op2);
  
  // Build the sequence of 7 numbers
  const sequence = [];
  let zw1Current = validParams.zw1Start;
  let zw2Current = validParams.zw2Start;
  
  // Position 1: Zw1
  sequence.push(zw1Current);
  
  // Position 2: Zw2
  sequence.push(zw2Current);
  
  // Positions 3-7: alternate Zw1 and Zw2
  for (let i = 2; i < 7; i++) {
    if (i % 2 === 0) {
      // Even index (2, 4, 6): Zw1
      zw1Current = applyOperation(zw1Current, op1);
      sequence.push(zw1Current);
    } else {
      // Odd index (3, 5): Zw2
      zw2Current = applyOperation(zw2Current, op2);
      sequence.push(zw2Current);
    }
  }
  
  // Calculate correct answers for positions 8 and 9
  // Position 8: after position 7 (Zw1), apply Zw2 operation
  const pos8 = applyOperation(zw2Current, op2);
  
  // Position 9: after position 8 (Zw2), apply Zw1 operation
  const pos9 = applyOperation(zw1Current, op1);
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > MAX_POSITION_VALUE || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > MAX_POSITION_VALUE || isNaN(pos9) || !isFinite(pos9)) {
    // Retry if invalid
    return generateSystem11Task();
  }
  
  // Validate sequence
  const invalidSequence = sequence.some(num => 
    !Number.isInteger(num) || num <= 0 || num > 100000 || isNaN(num) || !isFinite(num)
  );
  
  if (invalidSequence) {
    return generateSystem11Task();
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, op1, op2);
  
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
  
  // Randomly select two operation types
  const op1Type = operations[Math.floor(Math.random() * operations.length)];
  const op2Type = operations[Math.floor(Math.random() * operations.length)];
  
  // Generate values for operations
  let op1, op2;
  
  // Operation 1 (for Zw1)
  if (op1Type === '+' || op1Type === '-') {
    op1 = { type: op1Type, value: Math.floor(Math.random() * 20) + 2 }; // 2-21
  } else if (op1Type === '*') {
    op1 = { type: op1Type, value: Math.floor(Math.random() * 4) + 2 }; // 2-5
  } else { // division
    op1 = { type: op1Type, value: Math.floor(Math.random() * 3) + 2 }; // 2-4
  }
  
  // Operation 2 (for Zw2)
  if (op2Type === '+' || op2Type === '-') {
    op2 = { type: op2Type, value: Math.floor(Math.random() * 20) + 2 }; // 2-21
  } else if (op2Type === '*') {
    op2 = { type: op2Type, value: Math.floor(Math.random() * 4) + 2 }; // 2-5
  } else { // division
    op2 = { type: op2Type, value: Math.floor(Math.random() * 3) + 2 }; // 2-4
  }
  
  return { op1, op2 };
}

function generateValidParams(startZw1, startZw2, op1, op2) {
  // Try to find valid starting numbers that ensure all 9 positions are positive integers
  let valid = false;
  let attempts = 0;
  let zw1Start = startZw1;
  let zw2Start = startZw2;
  
  // Collect divisors
  const divisors = [];
  if (op1.type === '/') divisors.push(op1.value);
  if (op2.type === '/') divisors.push(op2.value);
  
  // Calculate LCM of divisors
  const lcm = divisors.length > 0 ? divisors.reduce((a, b) => {
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
    return (a * b) / gcd(a, b);
  }) : 1;
  
  while (!valid && attempts < 500) {
    // Adjust starting numbers
    if (divisors.length > 0) {
      const multiplier1 = Math.floor(Math.random() * 20) + 5;
      const multiplier2 = Math.floor(Math.random() * 20) + 5;
      zw1Start = lcm * multiplier1;
      zw2Start = lcm * multiplier2;
    } else {
      zw1Start = Math.floor(Math.random() * 40) + 10;
      zw2Start = Math.floor(Math.random() * 30) + 5;
    }
    
    // Test if these starting numbers produce valid sequence
    let zw1Current = zw1Start;
    let zw2Current = zw2Start;
    valid = true;
    
    try {
      // Position 1: Zw1
      // Position 2: Zw2
      
      // Positions 3-8: alternate Zw1 and Zw2
      for (let i = 2; i < 8; i++) {
        if (i % 2 === 0) {
          // Even index: Zw1
          if (op1.type === '/' && zw1Current % op1.value !== 0) {
            valid = false;
            break;
          }
          zw1Current = applyOperation(zw1Current, op1);
        } else {
          // Odd index: Zw2
          if (op2.type === '/' && zw2Current % op2.value !== 0) {
            valid = false;
            break;
          }
          zw2Current = applyOperation(zw2Current, op2);
        }
        
        if (zw1Current <= 0 || !Number.isInteger(zw1Current) || isNaN(zw1Current) || !isFinite(zw1Current) ||
            zw2Current <= 0 || !Number.isInteger(zw2Current) || isNaN(zw2Current) || !isFinite(zw2Current)) {
          valid = false;
          break;
        }
      }
      
      // Also check position 9
      if (valid) {
        if (op2.type === '/' && zw2Current % op2.value !== 0) {
          valid = false;
        } else {
          const pos8 = applyOperation(zw2Current, op2);
          
          if (pos8 <= 0 || !Number.isInteger(pos8) || isNaN(pos8) || !isFinite(pos8)) {
            valid = false;
          } else {
            if (op1.type === '/' && zw1Current % op1.value !== 0) {
              valid = false;
            } else {
              const pos9 = applyOperation(zw1Current, op1);
              
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
  
  // If we couldn't find valid numbers, use safe defaults
  if (!valid) {
    if (divisors.length > 0) {
      zw1Start = lcm * 10;
      zw2Start = lcm * 5;
    } else {
      zw1Start = Math.floor(Math.random() * 30) + 20;
      zw2Start = Math.floor(Math.random() * 20) + 10;
    }
  }
  
  return {
    zw1Start: zw1Start,
    zw2Start: zw2Start
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, op1, op2) {
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
        wrongPos9 = applyOperation(sequence[6], op1); // Apply op1 to pos7 (wrong Zw1 value)
        break;
      case 3:
        // Use wrong operation for position 8 (e.g., op1 instead of op2)
        wrongPos8 = applyOperation(sequence[6], op1); // Wrong: apply op1 instead of op2
        wrongPos9 = applyOperation(sequence[5], op2); // Wrong: apply op2 instead of op1
        break;
      case 4:
        // Use wrong Zw value for position 9
        wrongPos8 = applyOperation(sequence[6], op2);
        wrongPos9 = applyOperation(sequence[4], op1); // Wrong: use pos5 instead of pos7 for Zw1
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
