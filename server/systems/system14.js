// System 14: 3-step jump pattern (3er-Sprung) with single operation
// Dr1 with increasing values: 0x, x, 2x, 3x, ...
// Example: 19, 16, 28, 19, 32, 84, 76
// Position 1 → Position 4: Dr1 with 1x (x1): 19 * 1 = 19
// Position 2 → Position 5: Dr1 with 2x (x2): 16 * 2 = 32
// Position 3 → Position 6: Dr1 with 3x (x3): 28 * 3 = 84
// Position 4 → Position 7: Dr1 with 4x (x4): 19 * 4 = 76

import { MAX_POSITION_VALUE } from '../config.js';

export function generateSystem14Task() {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      // Generate one random operation type (all operations allowed)
      const operations = ['+', '-', '*', '/'];
      const operationType = operations[Math.floor(Math.random() * operations.length)];
      
      // Generate base value (x) for the operation
      let baseValue;
      if (operationType === '+' || operationType === '-') {
        baseValue = Math.floor(Math.random() * 10) + 1; // 1-10
      } else if (operationType === '*') {
        baseValue = Math.floor(Math.random() * 3) + 1; // 1-3
      } else { // division
        baseValue = Math.floor(Math.random() * 3) + 2; // 2-4
      }
      
      // Generate starting numbers for first 3 positions
      const start1 = Math.floor(Math.random() * 30) + 5; // 5-34
      const start2 = Math.floor(Math.random() * 30) + 5; // 5-34
      const start3 = Math.floor(Math.random() * 30) + 5; // 5-34
      
      // Generate valid starting numbers
      const validParams = generateValidParams(start1, start2, start3, operationType, baseValue);
      
      const result = generateSequence(validParams, operationType, baseValue);
      if (result) {
        return result;
      }
    } catch (error) {
      // Continue to next attempt
    }
    attempts++;
  }
  
  // If all attempts failed, return a safe default
  return generateSystem14TaskSafe();
}

function generateSequence(validParams, operationType, baseValue) {
  try {
    // Build the sequence of 7 numbers
    const sequence = [validParams.start1, validParams.start2, validParams.start3];
    
    // Position 4: Position 1 + Dr1 with 1x (first jump, multiplier = 1)
    const value1 = baseValue * 1;
    if (operationType === '/' && sequence[0] % value1 !== 0) {
      return null;
    }
    const pos4 = applyOperation(sequence[0], { type: operationType, value: value1 });
    if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
      return null;
    }
    sequence.push(pos4);
    
    // Position 5: Position 2 + Dr1 with 2x (second jump, multiplier = 2)
    const value2 = baseValue * 2;
    if (operationType === '/' && sequence[1] % value2 !== 0) {
      return null;
    }
    const pos5 = applyOperation(sequence[1], { type: operationType, value: value2 });
    if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
      return null;
    }
    sequence.push(pos5);
    
    // Position 6: Position 3 + Dr1 with 3x (third jump, multiplier = 3)
    const value3 = baseValue * 3;
    if (operationType === '/' && sequence[2] % value3 !== 0) {
      return null;
    }
    const pos6 = applyOperation(sequence[2], { type: operationType, value: value3 });
    if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
      return null;
    }
    sequence.push(pos6);
    
    // Position 7: Position 4 + Dr1 with 4x (fourth jump, multiplier = 4)
    const value4 = baseValue * 4;
    if (operationType === '/' && sequence[3] % value4 !== 0) {
      return null;
    }
    const pos7 = applyOperation(sequence[3], { type: operationType, value: value4 });
    if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
      return null;
    }
    sequence.push(pos7);
    
    // Validate sequence - check that numbers are valid
    const invalidSequence = sequence.some(num => 
      !Number.isInteger(num) || num <= 0 || num > 100000 || isNaN(num) || !isFinite(num)
    );
    
    if (invalidSequence || sequence.length !== 7) {
      return null;
    }
    
    // Calculate correct answers for positions 8 and 9
    // Position 8: Position 5 + Dr1 with 5x (fifth jump, multiplier = 5)
    const value5 = baseValue * 5;
    
    if (operationType === '/' && sequence[4] % value5 !== 0) {
      return null;
    }
    
    const pos8 = applyOperation(sequence[4], { type: operationType, value: value5 });
    
    // Position 9: Position 6 + Dr1 with 6x (sixth jump, multiplier = 6)
    const value6 = baseValue * 6;
    
    if (operationType === '/' && sequence[5] % value6 !== 0) {
      return null;
    }
    
    const pos9 = applyOperation(sequence[5], { type: operationType, value: value6 });
    
    // Final validation
    if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > MAX_POSITION_VALUE || isNaN(pos8) || !isFinite(pos8) ||
        !Number.isInteger(pos9) || pos9 <= 0 || pos9 > MAX_POSITION_VALUE || isNaN(pos9) || !isFinite(pos9)) {
      return null;
    }
    
    // Generate wrong answer pairs
    const wrongAnswerPairs = generateWrongAnswerPairs(
      pos8, 
      pos9, 
      sequence, 
      operationType,
      baseValue
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
  } catch (error) {
    return null;
  }
}

function generateSystem14TaskSafe() {
  // Safe fallback: use addition with baseValue = 2
  const operationType = '+';
  const baseValue = 2;
  
  const start1 = 10;
  const start2 = 15;
  const start3 = 20;
  
  const validParams = { start1, start2, start3 };
  return generateSequence(validParams, operationType, baseValue);
}

function generateValidParams(start1, start2, start3, operationType, baseValue) {
  // Try to find valid starting numbers that ensure all 9 positions are positive integers
  let valid = false;
  let attempts = 0;
  let s1 = start1;
  let s2 = start2;
  let s3 = start3;
  
  // Collect divisors (for division operations)
  const divisors = [];
  if (operationType === '/') {
    // We need to check divisors for multipliers 1-6
    for (let mult = 1; mult <= 6; mult++) {
      divisors.push(baseValue * mult);
    }
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
      // Position 4: Position 1 + Dr1 with 1x
      const value1 = baseValue * 1;
      if (operationType === '/' && testSequence[0] % value1 !== 0) {
        valid = false;
      } else {
        const pos4 = applyOperation(testSequence[0], { type: operationType, value: value1 });
        if (pos4 <= 0 || !Number.isInteger(pos4) || isNaN(pos4) || !isFinite(pos4)) {
          valid = false;
        } else {
          testSequence.push(pos4);
          
          // Position 5: Position 2 + Dr1 with 2x
          const value2 = baseValue * 2;
          if (operationType === '/' && testSequence[1] % value2 !== 0) {
            valid = false;
          } else {
            const pos5 = applyOperation(testSequence[1], { type: operationType, value: value2 });
            if (pos5 <= 0 || !Number.isInteger(pos5) || isNaN(pos5) || !isFinite(pos5)) {
              valid = false;
            } else {
              testSequence.push(pos5);
              
              // Position 6: Position 3 + Dr1 with 3x
              const value3 = baseValue * 3;
              if (operationType === '/' && testSequence[2] % value3 !== 0) {
                valid = false;
              } else {
                const pos6 = applyOperation(testSequence[2], { type: operationType, value: value3 });
                if (pos6 <= 0 || !Number.isInteger(pos6) || isNaN(pos6) || !isFinite(pos6)) {
                  valid = false;
                } else {
                  testSequence.push(pos6);
                  
                  // Position 7: Position 4 + Dr1 with 4x
                  const value4 = baseValue * 4;
                  if (operationType === '/' && testSequence[3] % value4 !== 0) {
                    valid = false;
                  } else {
                    const pos7 = applyOperation(testSequence[3], { type: operationType, value: value4 });
                    if (pos7 <= 0 || !Number.isInteger(pos7) || isNaN(pos7) || !isFinite(pos7)) {
                      valid = false;
                    } else {
                      testSequence.push(pos7);
                      
                      // Position 8: Position 5 + Dr1 with 5x
                      const value5 = baseValue * 5;
                      if (operationType === '/' && testSequence[4] % value5 !== 0) {
                        valid = false;
                      } else {
                        const pos8 = applyOperation(testSequence[4], { type: operationType, value: value5 });
                        if (pos8 <= 0 || !Number.isInteger(pos8) || isNaN(pos8) || !isFinite(pos8)) {
                          valid = false;
                        } else {
                          // Position 9: Position 6 + Dr1 with 6x
                          const value6 = baseValue * 6;
                          if (operationType === '/' && testSequence[5] % value6 !== 0) {
                            valid = false;
                          } else {
                            const pos9 = applyOperation(testSequence[5], { type: operationType, value: value6 });
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
  
  // If we couldn't find valid numbers, try one more time with safe defaults
  if (!valid) {
    // Try with safe defaults that are guaranteed to work for addition
    if (divisors.length > 0) {
      const multiplier = 20; // Use larger multiplier for division
      s1 = lcm * multiplier;
      s2 = lcm * multiplier;
      s3 = lcm * multiplier;
    } else {
      // For non-division operations, use larger starting numbers
      s1 = Math.floor(Math.random() * 20) + 20;
      s2 = Math.floor(Math.random() * 20) + 20;
      s3 = Math.floor(Math.random() * 20) + 20;
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, operationType, baseValue) {
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
        const value6Wrong = baseValue * 6;
        wrongPos9 = applyOperation(sequence[5], { type: operationType, value: value6Wrong });
        break;
      case 3:
        // Use wrong multiplier for position 8 (e.g., 4x instead of 5x)
        const value4 = baseValue * 4;
        wrongPos8 = applyOperation(sequence[4], { type: operationType, value: value4 });
        const value6Correct = baseValue * 6;
        wrongPos9 = applyOperation(sequence[5], { type: operationType, value: value6Correct });
        break;
      case 4:
        // Use wrong multiplier for position 9 (e.g., 5x instead of 6x)
        const value5Correct = baseValue * 5;
        wrongPos8 = applyOperation(sequence[4], { type: operationType, value: value5Correct });
        const value5 = baseValue * 5;
        wrongPos9 = applyOperation(sequence[5], { type: operationType, value: value5 });
        break;
      case 5:
        // Use wrong source position
        const value5Wrong = baseValue * 5;
        wrongPos8 = applyOperation(sequence[3], { type: operationType, value: value5Wrong }); // Wrong: use pos4 instead of pos5
        wrongPos9 = applyOperation(sequence[4], { type: operationType, value: baseValue * 1 }); // Wrong: use pos5 instead of pos6
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
