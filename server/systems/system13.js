// System 13: 3-step jump pattern (3er-Sprung)
// Operations are applied with a jump of 3 positions
// Dr1 and Dr2 are CONSTANT (do not change per step)
// Example: 17, 20, 15, 102, 26, 90, 108
// Position 1 → Position 4: Dr1 (x6): 17 * 6 = 102
// Position 2 → Position 5: Dr2 (+6): 20 + 6 = 26
// Position 3 → Position 6: Dr1 (x6): 15 * 6 = 90
// Position 4 → Position 7: Dr2 (+6): 102 + 6 = 108

import { MAX_POSITION_VALUE } from '../config.js';

export function generateSystem13Task() {
  // Generate two random operations (CONSTANT, do not change)
  const { dr1Op, dr2Op } = generateRandomOperations();
  
  // Generate starting numbers for first 3 positions
  const start1 = Math.floor(Math.random() * 30) + 5; // 5-34
  const start2 = Math.floor(Math.random() * 30) + 5; // 5-34
  const start3 = Math.floor(Math.random() * 30) + 5; // 5-34
  
  // Generate valid starting numbers
  const validParams = generateValidParams(start1, start2, start3, dr1Op, dr2Op);
  
  // Build the sequence of 7 numbers
  const sequence = [validParams.start1, validParams.start2, validParams.start3];
  
  // Position 4: Position 1 + Dr1 (constant)
  const pos4 = applyOperation(sequence[0], dr1Op);
  sequence.push(pos4);
  
  // Position 5: Position 2 + Dr2 (constant)
  const pos5 = applyOperation(sequence[1], dr2Op);
  sequence.push(pos5);
  
  // Position 6: Position 3 + Dr1 (constant)
  const pos6 = applyOperation(sequence[2], dr1Op);
  sequence.push(pos6);
  
  // Position 7: Position 4 + Dr2 (constant)
  const pos7 = applyOperation(sequence[3], dr2Op);
  sequence.push(pos7);
  
  // Validate sequence
  const invalidSequence = sequence.some(num => 
    !Number.isInteger(num) || num <= 0 || num > 100000 || isNaN(num) || !isFinite(num)
  );
  
  if (invalidSequence || sequence.length !== 7) {
    return generateSystem13Task();
  }
  
  // Calculate correct answers for positions 8 and 9
  // Position 8: Position 5 + Dr1 (constant)
  if (dr1Op.type === '/' && sequence[4] % dr1Op.value !== 0) {
    return generateSystem13Task();
  }
  
  const pos8 = applyOperation(sequence[4], dr1Op);
  
  // Position 9: Position 6 + Dr2 (constant)
  if (dr2Op.type === '/' && sequence[5] % dr2Op.value !== 0) {
    return generateSystem13Task();
  }
  
  const pos9 = applyOperation(sequence[5], dr2Op);
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > MAX_POSITION_VALUE || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > MAX_POSITION_VALUE || isNaN(pos9) || !isFinite(pos9)) {
    // Retry if invalid
    return generateSystem13Task();
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(
    pos8, 
    pos9, 
    sequence, 
    dr1Op,
    dr2Op
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

function generateRandomOperations() {
  const operations = ['+', '-', '*', '/'];
  
  // Randomly select two operation types
  const dr1Type = operations[Math.floor(Math.random() * operations.length)];
  const dr2Type = operations[Math.floor(Math.random() * operations.length)];
  
  // Generate ONE value that will be used by BOTH operations
  // The value must work for both operation types
  let commonValue;
  
  // Determine a safe value range that works for both operations
  if ((dr1Type === '*' || dr1Type === '/') || (dr2Type === '*' || dr2Type === '/')) {
    // If either operation is multiplication or division, use smaller values
    commonValue = Math.floor(Math.random() * 4) + 2; // 2-5
  } else {
    // Both are addition/subtraction, can use larger values
    commonValue = Math.floor(Math.random() * 20) + 2; // 2-21
  }
  
  // Create operations with the SAME value
  const dr1Op = { type: dr1Type, value: commonValue };
  const dr2Op = { type: dr2Type, value: commonValue };
  
  return { dr1Op, dr2Op };
}

function generateValidParams(start1, start2, start3, dr1Op, dr2Op) {
  // Try to find valid starting numbers that ensure all 9 positions are positive integers
  let valid = false;
  let attempts = 0;
  let s1 = start1;
  let s2 = start2;
  let s3 = start3;
  
  // Collect divisors
  const divisors = [];
  if (dr1Op.type === '/') {
    divisors.push(dr1Op.value);
  }
  if (dr2Op.type === '/') {
    divisors.push(dr2Op.value);
  }
  
  // Calculate LCM of divisors
  const uniqueDivisors = [...new Set(divisors)];
  const lcm = uniqueDivisors.length > 0 ? uniqueDivisors.reduce((a, b) => {
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
    return (a * b) / gcd(a, b);
  }) : 1;
  
  while (!valid && attempts < 500) {
    // Adjust starting numbers
    if (divisors.length > 0) {
      const multiplier = Math.floor(Math.random() * 20) + 5;
      s1 = lcm * multiplier;
      s2 = lcm * multiplier;
      s3 = lcm * multiplier;
    } else {
      s1 = Math.floor(Math.random() * 30) + 5;
      s2 = Math.floor(Math.random() * 30) + 5;
      s3 = Math.floor(Math.random() * 30) + 5;
    }
    
    // Test if these starting numbers produce valid sequence
    const testSequence = [s1, s2, s3];
    valid = true;
    
    try {
      // Position 4: Position 1 + Dr1 (constant)
      if (dr1Op.type === '/' && testSequence[0] % dr1Op.value !== 0) {
        valid = false;
      } else {
        const pos4 = applyOperation(testSequence[0], dr1Op);
        if (pos4 <= 0 || !Number.isInteger(pos4) || isNaN(pos4) || !isFinite(pos4)) {
          valid = false;
        } else {
          testSequence.push(pos4);
          
          // Position 5: Position 2 + Dr2 (constant)
          if (dr2Op.type === '/' && testSequence[1] % dr2Op.value !== 0) {
            valid = false;
          } else {
            const pos5 = applyOperation(testSequence[1], dr2Op);
            if (pos5 <= 0 || !Number.isInteger(pos5) || isNaN(pos5) || !isFinite(pos5)) {
              valid = false;
            } else {
              testSequence.push(pos5);
              
              // Position 6: Position 3 + Dr1 (constant)
              if (dr1Op.type === '/' && testSequence[2] % dr1Op.value !== 0) {
                valid = false;
              } else {
                const pos6 = applyOperation(testSequence[2], dr1Op);
                if (pos6 <= 0 || !Number.isInteger(pos6) || isNaN(pos6) || !isFinite(pos6)) {
                  valid = false;
                } else {
                  testSequence.push(pos6);
                  
                  // Position 7: Position 4 + Dr2 (constant)
                  if (dr2Op.type === '/' && testSequence[3] % dr2Op.value !== 0) {
                    valid = false;
                  } else {
                    const pos7 = applyOperation(testSequence[3], dr2Op);
                    if (pos7 <= 0 || !Number.isInteger(pos7) || isNaN(pos7) || !isFinite(pos7)) {
                      valid = false;
                    } else {
                      testSequence.push(pos7);
                      
                      // Position 8: Position 5 + Dr1 (constant)
                      if (dr1Op.type === '/' && testSequence[4] % dr1Op.value !== 0) {
                        valid = false;
                      } else {
                        const pos8 = applyOperation(testSequence[4], dr1Op);
                        if (pos8 <= 0 || !Number.isInteger(pos8) || isNaN(pos8) || !isFinite(pos8)) {
                          valid = false;
                        } else {
                          // Position 9: Position 6 + Dr2 (constant)
                          if (dr2Op.type === '/' && testSequence[5] % dr2Op.value !== 0) {
                            valid = false;
                          } else {
                            const pos9 = applyOperation(testSequence[5], dr2Op);
                            if (pos9 <= 0 || !Number.isInteger(pos9) || isNaN(pos9) || !isFinite(pos9)) {
                              valid = false;
                            }
                          }
                        }
                      }
                    }
                  }
                }
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
      const multiplier = 10;
      s1 = lcm * multiplier;
      s2 = lcm * multiplier;
      s3 = lcm * multiplier;
    } else {
      s1 = Math.floor(Math.random() * 20) + 15;
      s2 = Math.floor(Math.random() * 20) + 15;
      s3 = Math.floor(Math.random() * 20) + 15;
    }
  }
  
  return {
    start1: s1,
    start2: s2,
    start3: s3
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, dr1Op, dr2Op) {
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
        wrongPos9 = applyOperation(sequence[5], dr2Op);
        break;
      case 3:
        // Use wrong operation for position 8
        wrongPos8 = applyOperation(sequence[4], dr2Op); // Wrong: use Dr2 instead of Dr1
        wrongPos9 = applyOperation(sequence[5], dr2Op);
        break;
      case 4:
        // Use wrong operation for position 9
        wrongPos8 = applyOperation(sequence[4], dr1Op);
        wrongPos9 = applyOperation(sequence[5], dr1Op); // Wrong: use Dr1 instead of Dr2
        break;
      case 5:
        // Use wrong source position
        wrongPos8 = applyOperation(sequence[3], dr1Op); // Wrong: use pos4 instead of pos5
        wrongPos9 = applyOperation(sequence[4], dr2Op); // Wrong: use pos5 instead of pos6
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
