// System 12: Two interleaved sequences (Zw1, Zw2, Zw1, Zw2, ...)
// Zw1 changes per cycle (with 0x, 1x, 2x multipliers)
// Zw2 remains constant
// Example: 23, 28, 29, 23, 42, 18, 62
// Zw1 (positions 1, 3, 5, 7): 23, 29, 42, 62 with changing operation (+6, +13, +20)
// Zw2 (positions 2, 4, 6): 28, 23, 18 with constant operation (-5)

import { MAX_POSITION_VALUE } from '../config.js';

export function generateSystem12Task() {
  // Generate operation types
  const { zw1Op, zw2Op } = generateRandomOperationTypes();
  
  // Generate parameters for Zw1 (changing) and Zw2 (constant)
  const zw1Params = generateOperationParams(zw1Op.type);
  const zw2Params = generateOperationParams(zw2Op.type);
  
  // Generate starting numbers for both sequences
  const startZw1 = Math.floor(Math.random() * 40) + 10; // 10-49
  const startZw2 = Math.floor(Math.random() * 30) + 5; // 5-34
  
  // Generate valid starting numbers
  const validParams = generateValidParams(startZw1, startZw2, zw1Op, zw1Params, zw2Op, zw2Params);
  
  // Build the sequence of 7 numbers
  const sequence = [];
  let zw1Current = validParams.zw1Start;
  let zw2Current = validParams.zw2Start;
  
  // Position 1: Zw1 (cycle 0)
  sequence.push(zw1Current);
  
  // Position 2: Zw2
  sequence.push(zw2Current);
  
  // Positions 3-7: alternate Zw1 and Zw2
  for (let i = 2; i < 7; i++) {
    if (i % 2 === 0) {
      // Even index (2, 4, 6): Zw1 (changing per cycle)
      const cycle = Math.floor(i / 2); // Cycle 1, 2, 3
      const opValue = zw1Params.initial + cycle * zw1Params.increment;
      
      // Check if division will be exact before applying
      if (zw1Op.type === '/' && zw1Current % opValue !== 0) {
        return generateSystem12Task();
      }
      
      zw1Current = applyOperation(zw1Current, { type: zw1Op.type, value: opValue });
      
      // Validate Zw1 result
      if (!Number.isInteger(zw1Current) || zw1Current <= 0 || zw1Current > 100000 || isNaN(zw1Current) || !isFinite(zw1Current)) {
        return generateSystem12Task();
      }
      
      sequence.push(zw1Current);
    } else {
      // Odd index (3, 5): Zw2 (constant)
      
      // Check if division will be exact before applying
      if (zw2Op.type === '/' && zw2Current % zw2Params.initial !== 0) {
        return generateSystem12Task();
      }
      
      zw2Current = applyOperation(zw2Current, { type: zw2Op.type, value: zw2Params.initial });
      
      // Validate Zw2 result
      if (!Number.isInteger(zw2Current) || zw2Current <= 0 || zw2Current > 100000 || isNaN(zw2Current) || !isFinite(zw2Current)) {
        return generateSystem12Task();
      }
      
      sequence.push(zw2Current);
    }
  }
  
  // Validate that sequence has exactly 7 numbers
  if (sequence.length !== 7) {
    return generateSystem12Task();
  }
  
  // Calculate correct answers for positions 8 and 9
  // Position 8: after position 7 (Zw1, cycle 3), apply Zw2 operation
  if (zw2Op.type === '/' && zw2Current % zw2Params.initial !== 0) {
    return generateSystem12Task();
  }
  const pos8 = applyOperation(zw2Current, { type: zw2Op.type, value: zw2Params.initial });
  
  // Position 9: after position 8 (Zw2), apply Zw1 operation (cycle 3)
  const cycle3 = 3;
  const zw1Value3 = zw1Params.initial + cycle3 * zw1Params.increment;
  
  if (zw1Op.type === '/' && zw1Current % zw1Value3 !== 0) {
    return generateSystem12Task();
  }
  const pos9 = applyOperation(zw1Current, { type: zw1Op.type, value: zw1Value3 });
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > MAX_POSITION_VALUE || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > MAX_POSITION_VALUE || isNaN(pos9) || !isFinite(pos9)) {
    // Retry if invalid
    return generateSystem12Task();
  }
  
  // Validate sequence
  const invalidSequence = sequence.some(num => 
    !Number.isInteger(num) || num <= 0 || num > 100000 || isNaN(num) || !isFinite(num)
  );
  
  if (invalidSequence) {
    return generateSystem12Task();
  }
  
  // Additional validation: verify Zw1 and Zw2 sequences are consistent
  // Zw1 should be at positions 0, 2, 4, 6
  // Zw2 should be at positions 1, 3, 5
  let zw1Test = sequence[0];
  let zw2Test = sequence[1];
  
  // Verify Zw1 sequence (positions 0, 2, 4, 6)
  for (let i = 1; i <= 3; i++) {
    const cycle = i;
    const opValue = zw1Params.initial + cycle * zw1Params.increment;
    const expected = applyOperation(zw1Test, { type: zw1Op.type, value: opValue });
    const actual = sequence[i * 2];
    
    if (expected !== actual) {
      return generateSystem12Task();
    }
    zw1Test = actual;
  }
  
  // Verify Zw2 sequence (positions 1, 3, 5)
  for (let i = 1; i <= 2; i++) {
    const expected = applyOperation(zw2Test, { type: zw2Op.type, value: zw2Params.initial });
    const actual = sequence[i * 2 + 1];
    
    if (expected !== actual) {
      return generateSystem12Task();
    }
    zw2Test = actual;
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(
    pos8, 
    pos9, 
    sequence, 
    zw1Op,
    zw1Params,
    zw2Op,
    zw2Params
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
  
  // Randomly select two operation types
  const zw1Type = operations[Math.floor(Math.random() * operations.length)];
  const zw2Type = operations[Math.floor(Math.random() * operations.length)];
  
  return {
    zw1Op: { type: zw1Type },
    zw2Op: { type: zw2Type }
  };
}

function generateOperationParams(operationType) {
  let initial, increment;
  
  switch (operationType) {
    case '+':
      // Addition: initial value 2-20, increment 1-8
      initial = Math.floor(Math.random() * 19) + 2; // 2-20
      increment = Math.floor(Math.random() * 8) + 1; // 1-8
      break;
    case '-':
      // Subtraction: initial value 2-20, increment 1-8
      initial = Math.floor(Math.random() * 19) + 2; // 2-20
      increment = Math.floor(Math.random() * 8) + 1; // 1-8
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

function generateValidParams(startZw1, startZw2, zw1Op, zw1Params, zw2Op, zw2Params) {
  // Try to find valid starting numbers that ensure all 9 positions are positive integers
  let valid = false;
  let attempts = 0;
  let zw1Start = startZw1;
  let zw2Start = startZw2;
  
  // Collect divisors
  const divisors = [];
  if (zw1Op.type === '/') {
    // Add all possible divisors for Zw1 (changing)
    for (let cycle = 0; cycle <= 3; cycle++) {
      divisors.push(zw1Params.initial + cycle * zw1Params.increment);
    }
  }
  if (zw2Op.type === '/') {
    divisors.push(zw2Params.initial);
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
          // Even index: Zw1 (changing per cycle)
          const cycle = Math.floor(i / 2);
          const opValue = zw1Params.initial + cycle * zw1Params.increment;
          
          if (zw1Op.type === '/' && zw1Current % opValue !== 0) {
            valid = false;
            break;
          }
          
          zw1Current = applyOperation(zw1Current, { type: zw1Op.type, value: opValue });
        } else {
          // Odd index: Zw2 (constant)
          if (zw2Op.type === '/' && zw2Current % zw2Params.initial !== 0) {
            valid = false;
            break;
          }
          
          zw2Current = applyOperation(zw2Current, { type: zw2Op.type, value: zw2Params.initial });
        }
        
        if (zw1Current <= 0 || !Number.isInteger(zw1Current) || isNaN(zw1Current) || !isFinite(zw1Current) ||
            zw2Current <= 0 || !Number.isInteger(zw2Current) || isNaN(zw2Current) || !isFinite(zw2Current)) {
          valid = false;
          break;
        }
      }
      
      // Also check position 9
      if (valid) {
        if (zw2Op.type === '/' && zw2Current % zw2Params.initial !== 0) {
          valid = false;
        } else {
          const pos8 = applyOperation(zw2Current, { type: zw2Op.type, value: zw2Params.initial });
          
          if (pos8 <= 0 || !Number.isInteger(pos8) || isNaN(pos8) || !isFinite(pos8)) {
            valid = false;
          } else {
            const cycle3 = 3;
            const zw1Value3 = zw1Params.initial + cycle3 * zw1Params.increment;
            
            if (zw1Op.type === '/' && zw1Current % zw1Value3 !== 0) {
              valid = false;
            } else {
              const pos9 = applyOperation(zw1Current, { type: zw1Op.type, value: zw1Value3 });
              
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, zw1Op, zw1Params, zw2Op, zw2Params) {
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
        const cycle3 = 3;
        const zw1Value3 = zw1Params.initial + cycle3 * zw1Params.increment;
        wrongPos9 = applyOperation(sequence[6], { type: zw1Op.type, value: zw1Value3 });
        break;
      case 3:
        // Use wrong cycle for Zw1 in position 9
        wrongPos8 = applyOperation(sequence[6], { type: zw2Op.type, value: zw2Params.initial });
        const cycle2 = 2;
        const zw1Value2 = zw1Params.initial + cycle2 * zw1Params.increment;
        wrongPos9 = applyOperation(sequence[6], { type: zw1Op.type, value: zw1Value2 });
        break;
      case 4:
        // Use wrong operation for position 8
        wrongPos8 = applyOperation(sequence[5], { type: zw1Op.type, value: zw1Params.initial });
        const zw1Value3Correct = zw1Params.initial + 3 * zw1Params.increment;
        wrongPos9 = applyOperation(sequence[6], { type: zw1Op.type, value: zw1Value3Correct });
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
