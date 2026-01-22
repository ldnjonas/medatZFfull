// System 15: Two patterns - 1er-Sprung or 2er-Sprung
// Pattern 1 (1er-Sprung): Two operations applied sequentially: Z(n+1) = (Z(n) op1 value1) op2 value2
// Pattern 2 (2er-Sprung): Differences between numbers 2 positions apart follow arithmetic progression
// Z(n+2) = Z(n) + (Zw1 + (k * x)), where k is the step index (0, 1, 2, ...)

export function generateSystem15Task() {
  // Randomly choose between Pattern 1 (1er-Sprung) and Pattern 2 (2er-Sprung)
  const usePattern1 = Math.random() > 0.5;
  
  if (usePattern1) {
    return generatePattern1Task();
  } else {
    return generatePattern2Task();
  }
}

// Pattern 1: 1er-Sprung - Two operations applied sequentially
// Z(n+1) = (Z(n) op1 value1) op2 value2
function generatePattern1Task() {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      // Generate two random operations
      const operations = ['+', '-', '*', '/'];
      const op1 = operations[Math.floor(Math.random() * operations.length)];
      const op2 = operations[Math.floor(Math.random() * operations.length)];
      
      // Generate values for operations
      let value1, value2;
      if (op1 === '+' || op1 === '-') {
        value1 = Math.floor(Math.random() * 20) + 2; // 2-21
      } else if (op1 === '*') {
        value1 = Math.floor(Math.random() * 4) + 2; // 2-5
      } else { // division
        value1 = Math.floor(Math.random() * 3) + 2; // 2-4
      }
      
      if (op2 === '+' || op2 === '-') {
        value2 = Math.floor(Math.random() * 20) + 2; // 2-21
      } else if (op2 === '*') {
        value2 = Math.floor(Math.random() * 4) + 2; // 2-5
      } else { // division
        value2 = Math.floor(Math.random() * 3) + 2; // 2-4
      }
      
      // Generate starting number
      const start = Math.floor(Math.random() * 30) + 5; // 5-34
      
      // Generate valid starting number
      const validStart = generateValidStartPattern1(start, op1, value1, op2, value2);
      
      // Build sequence
      const sequence = [validStart];
      
      for (let i = 0; i < 6; i++) {
        // Apply two operations sequentially
        let result = applyOperation(sequence[i], { type: op1, value: value1 });
        result = applyOperation(result, { type: op2, value: value2 });
        
        // Validate
        if (!Number.isInteger(result) || result <= 0 || result > 100000 || isNaN(result) || !isFinite(result)) {
          throw new Error('Invalid sequence value');
        }
        
        sequence.push(result);
      }
      
      // Calculate positions 8 and 9
      let pos8 = applyOperation(sequence[6], { type: op1, value: value1 });
      pos8 = applyOperation(pos8, { type: op2, value: value2 });
      
      let pos9 = applyOperation(sequence[7], { type: op1, value: value1 });
      pos9 = applyOperation(pos9, { type: op2, value: value2 });
      
      // Final validation
      if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
          !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
        throw new Error('Invalid answer values');
      }
      
      // Validate sequence length
      if (sequence.length !== 7) {
        throw new Error(`Invalid sequence length: ${sequence.length}, expected 7`);
      }
      
      // Generate wrong answer pairs
      const wrongAnswerPairs = generateWrongAnswerPairsPattern1(pos8, pos9, sequence, op1, value1, op2, value2);
      
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
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        // Fallback to safe pattern
        return generatePattern1Safe();
      }
    }
  }
  
  return generatePattern1Safe();
}

// Pattern 2: 2er-Sprung - Differences between numbers 2 positions apart follow geometric progression
// Z(n+2) = Z(n) + (Zw1 * (x^k)), where k is the step index (0, 1, 2, ...)
// Example: x=4 means differences are Zw1*1, Zw1*4, Zw1*16, Zw1*64, ...
function generatePattern2Task() {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      // Generate operation type for the difference
      const operations = ['+', '-', '*', '/'];
      const operationType = operations[Math.floor(Math.random() * operations.length)];
      
      // Generate Zw1 (base difference value) and x (geometric multiplier)
      // x will be used as: Zw1 * (x^0), Zw1 * (x^1), Zw1 * (x^2), ...
      let zw1, x;
      if (operationType === '+' || operationType === '-') {
        zw1 = Math.floor(Math.random() * 10) + 2; // 2-11
        x = Math.floor(Math.random() * 3) + 2; // 2-4 (geometric multiplier)
      } else if (operationType === '*') {
        zw1 = Math.floor(Math.random() * 2) + 2; // 2-3
        x = Math.floor(Math.random() * 2) + 2; // 2-3
      } else { // division
        zw1 = Math.floor(Math.random() * 2) + 2; // 2-3
        x = Math.floor(Math.random() * 2) + 2; // 2-3
      }
      
      // Generate starting numbers for positions 1 and 2
      const start1 = Math.floor(Math.random() * 30) + 5; // 5-34
      const start2 = Math.floor(Math.random() * 30) + 5; // 5-34
      
      // Generate valid starting numbers
      const validParams = generateValidStartPattern2(start1, start2, operationType, zw1, x);
      
      // Build sequence
      const sequence = [validParams.start1, validParams.start2];
      
      // Position 3: Position 1 + (Zw1 * x^0) = Position 1 + Zw1
      const diff0 = zw1 * Math.pow(x, 0); // zw1 * 1
      let pos3 = applyOperation(sequence[0], { type: operationType, value: diff0 });
      if (!Number.isInteger(pos3) || pos3 <= 0 || pos3 > 100000 || isNaN(pos3) || !isFinite(pos3)) {
        throw new Error('Invalid position 3');
      }
      sequence.push(pos3);
      
      // Position 4: Position 2 + (Zw1 * x^1) = Position 2 + Zw1*x
      const diff1 = zw1 * Math.pow(x, 1); // zw1 * x
      let pos4 = applyOperation(sequence[1], { type: operationType, value: diff1 });
      if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
        throw new Error('Invalid position 4');
      }
      sequence.push(pos4);
      
      // Position 5: Position 3 + (Zw1 * x^2) = Position 3 + Zw1*x^2
      const diff2 = zw1 * Math.pow(x, 2); // zw1 * x^2
      let pos5 = applyOperation(sequence[2], { type: operationType, value: diff2 });
      if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
        throw new Error('Invalid position 5');
      }
      sequence.push(pos5);
      
      // Position 6: Position 4 + (Zw1 * x^3) = Position 4 + Zw1*x^3
      const diff3 = zw1 * Math.pow(x, 3); // zw1 * x^3
      let pos6 = applyOperation(sequence[3], { type: operationType, value: diff3 });
      if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
        throw new Error('Invalid position 6');
      }
      sequence.push(pos6);
      
      // Position 7: Position 5 + (Zw1 * x^4) = Position 5 + Zw1*x^4
      const diff4 = zw1 * Math.pow(x, 4); // zw1 * x^4
      let pos7 = applyOperation(sequence[4], { type: operationType, value: diff4 });
      if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
        throw new Error('Invalid position 7');
      }
      sequence.push(pos7);
      
      // Calculate positions 8 and 9
      // Position 8: Position 6 + (Zw1 * x^5) = Position 6 + Zw1*x^5
      const diff5 = zw1 * Math.pow(x, 5); // zw1 * x^5
      if (operationType === '/' && sequence[5] % diff5 !== 0) {
        throw new Error('Invalid division for position 8');
      }
      let pos8 = applyOperation(sequence[5], { type: operationType, value: diff5 });
      
      // Position 9: Position 7 + (Zw1 * x^6) = Position 7 + Zw1*x^6
      const diff6 = zw1 * Math.pow(x, 6); // zw1 * x^6
      if (operationType === '/' && sequence[6] % diff6 !== 0) {
        throw new Error('Invalid division for position 9');
      }
      let pos9 = applyOperation(sequence[6], { type: operationType, value: diff6 });
      
      // Final validation
      if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
          !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
        throw new Error('Invalid answer values');
      }
      
      // Validate sequence length
      if (sequence.length !== 7) {
        throw new Error(`Invalid sequence length: ${sequence.length}, expected 7`);
      }
      
      // Generate wrong answer pairs
      const wrongAnswerPairs = generateWrongAnswerPairsPattern2(pos8, pos9, sequence, operationType, zw1, x);
      
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
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        // Fallback to safe pattern
        return generatePattern2Safe();
      }
    }
  }
  
  return generatePattern2Safe();
}

function generateValidStartPattern1(start, op1, value1, op2, value2) {
  // Collect divisors
  const divisors = [];
  if (op1 === '/') divisors.push(value1);
  if (op2 === '/') divisors.push(value2);
  
  // Calculate LCM
  const uniqueDivisors = [...new Set(divisors)];
  const lcm = uniqueDivisors.length > 0 ? uniqueDivisors.reduce((a, b) => {
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
    return (a * b) / gcd(a, b);
  }) : 1;
  
  let valid = false;
  let attempts = 0;
  let s = start;
  
  while (!valid && attempts < 500) {
    if (divisors.length > 0) {
      const multiplier = Math.floor(Math.random() * 20) + 5;
      s = lcm * multiplier;
    } else {
      s = Math.floor(Math.random() * 30) + 5;
    }
    
    // Test if this starting number produces valid sequence
    const testSequence = [s];
    valid = true;
    
    try {
      for (let i = 0; i < 8; i++) {
        let result = applyOperation(testSequence[i], { type: op1, value: value1 });
        result = applyOperation(result, { type: op2, value: value2 });
        
        if (!Number.isInteger(result) || result <= 0 || result > 100000 || isNaN(result) || !isFinite(result)) {
          valid = false;
          break;
        }
        testSequence.push(result);
      }
    } catch (error) {
      valid = false;
    }
    
    attempts++;
  }
  
  if (!valid) {
    if (divisors.length > 0) {
      s = lcm * 20;
    } else {
      s = 20;
    }
  }
  
  return s;
}

function generateValidStartPattern2(start1, start2, operationType, zw1, x) {
  // Collect divisors (geometric progression: zw1 * x^0, zw1 * x^1, zw1 * x^2, ...)
  const divisors = [];
  for (let k = 0; k <= 6; k++) {
    const diff = zw1 * Math.pow(x, k);
    if (operationType === '/') {
      divisors.push(diff);
    }
  }
  
  // Calculate LCM
  const uniqueDivisors = [...new Set(divisors)];
  const lcm = uniqueDivisors.length > 0 ? uniqueDivisors.reduce((a, b) => {
    const gcd = (x, y) => y === 0 ? x : gcd(y, x % y);
    return (a * b) / gcd(a, b);
  }) : 1;
  
  let valid = false;
  let attempts = 0;
  let s1 = start1;
  let s2 = start2;
  
  while (!valid && attempts < 500) {
    if (divisors.length > 0) {
      const multiplier = Math.floor(Math.random() * 20) + 5;
      s1 = lcm * multiplier;
      s2 = lcm * multiplier;
    } else {
      s1 = Math.floor(Math.random() * 30) + 5;
      s2 = Math.floor(Math.random() * 30) + 5;
    }
    
    // Test if these starting numbers produce valid sequence
    const testSequence = [s1, s2];
    valid = true;
    
    try {
      for (let i = 0; i < 5; i++) {
        const diff = zw1 * Math.pow(x, i);
        if (operationType === '/' && testSequence[i] % diff !== 0) {
          valid = false;
          break;
        }
        const next = applyOperation(testSequence[i], { type: operationType, value: diff });
        if (!Number.isInteger(next) || next <= 0 || next > 100000 || isNaN(next) || !isFinite(next)) {
          valid = false;
          break;
        }
        testSequence.push(next);
      }
    } catch (error) {
      valid = false;
    }
    
    attempts++;
  }
  
  if (!valid) {
    if (divisors.length > 0) {
      const multiplier = 20;
      s1 = lcm * multiplier;
      s2 = lcm * multiplier;
    } else {
      s1 = 20;
      s2 = 25;
    }
  }
  
  return {
    start1: s1,
    start2: s2
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

function generateWrongAnswerPairsPattern1(correctPos8, correctPos9, sequence, op1, value1, op2, value2) {
  const wrongPairs = new Set();
  let attempts = 0;
  const maxAttempts = 200;
  
  while (wrongPairs.size < 4 && attempts < maxAttempts) {
    attempts++;
    const variation = Math.floor(Math.random() * 5);
    let wrongPos8, wrongPos9;
    
    try {
      switch (variation) {
        case 0:
          wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          break;
        case 1:
          wrongPos8 = correctPos8;
          wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 15) + 5);
          break;
        case 2:
          wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          // Apply wrong operations
          if (sequence.length > 7) {
            wrongPos9 = applyOperation(sequence[7], { type: op1, value: value1 });
            wrongPos9 = applyOperation(wrongPos9, { type: op2, value: value2 });
          } else {
            wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          }
          break;
        case 3:
          // Use wrong first operation
          if (sequence.length > 6) {
            wrongPos8 = applyOperation(sequence[6], { type: op2, value: value2 });
            wrongPos8 = applyOperation(wrongPos8, { type: op1, value: value1 });
          } else {
            wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          }
          if (sequence.length > 7) {
            wrongPos9 = applyOperation(sequence[7], { type: op1, value: value1 });
            wrongPos9 = applyOperation(wrongPos9, { type: op2, value: value2 });
          } else {
            wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          }
          break;
        case 4:
          // Use wrong values
          if (sequence.length > 6) {
            wrongPos8 = applyOperation(sequence[6], { type: op1, value: value1 + 1 });
            wrongPos8 = applyOperation(wrongPos8, { type: op2, value: value2 });
          } else {
            wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          }
          if (sequence.length > 7) {
            wrongPos9 = applyOperation(sequence[7], { type: op1, value: value1 });
            wrongPos9 = applyOperation(wrongPos9, { type: op2, value: value2 + 1 });
          } else {
            wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          }
          break;
      }
      
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

function generateWrongAnswerPairsPattern2(correctPos8, correctPos9, sequence, operationType, zw1, x) {
  const wrongPairs = new Set();
  let attempts = 0;
  const maxAttempts = 200;
  
  while (wrongPairs.size < 4 && attempts < maxAttempts) {
    attempts++;
    const variation = Math.floor(Math.random() * 5);
    let wrongPos8, wrongPos9;
    
    try {
      switch (variation) {
        case 0:
          wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          break;
        case 1:
          wrongPos8 = correctPos8;
          wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 15) + 5);
          break;
        case 2:
          wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          if (sequence.length > 6) {
            const diff6Wrong = zw1 * Math.pow(x, 6);
            if (operationType === '/' && sequence[6] % diff6Wrong !== 0) {
              wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
            } else {
              wrongPos9 = applyOperation(sequence[6], { type: operationType, value: diff6Wrong });
            }
          } else {
            wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          }
          break;
        case 3:
          // Use wrong step index
          if (sequence.length > 5) {
            const diff4 = zw1 * Math.pow(x, 4);
            if (operationType === '/' && sequence[5] % diff4 !== 0) {
              wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
            } else {
              wrongPos8 = applyOperation(sequence[5], { type: operationType, value: diff4 });
            }
          } else {
            wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          }
          if (sequence.length > 6) {
            const diff6Correct = zw1 * Math.pow(x, 6);
            if (operationType === '/' && sequence[6] % diff6Correct !== 0) {
              wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
            } else {
              wrongPos9 = applyOperation(sequence[6], { type: operationType, value: diff6Correct });
            }
          } else {
            wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          }
          break;
        case 4:
          // Use wrong source position
          if (sequence.length > 4) {
            const diff5Wrong = zw1 * Math.pow(x, 5);
            if (operationType === '/' && sequence[4] % diff5Wrong !== 0) {
              wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
            } else {
              wrongPos8 = applyOperation(sequence[4], { type: operationType, value: diff5Wrong });
            }
          } else {
            wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          }
          if (sequence.length > 5) {
            const diff1 = zw1 * Math.pow(x, 1);
            if (operationType === '/' && sequence[5] % diff1 !== 0) {
              wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
            } else {
              wrongPos9 = applyOperation(sequence[5], { type: operationType, value: diff1 });
            }
          } else {
            wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          }
          break;
      }
      
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

function generatePattern1Safe() {
  // Safe fallback: use addition and subtraction
  const op1 = '*';
  const value1 = 2;
  const op2 = '-';
  const value2 = 4;
  const start = 7;
  
  const sequence = [start];
  for (let i = 0; i < 6; i++) {
    let result = applyOperation(sequence[i], { type: op1, value: value1 });
    result = applyOperation(result, { type: op2, value: value2 });
    sequence.push(result);
  }
  
  let pos8 = applyOperation(sequence[6], { type: op1, value: value1 });
  pos8 = applyOperation(pos8, { type: op2, value: value2 });
  
  let pos9 = applyOperation(sequence[7], { type: op1, value: value1 });
  pos9 = applyOperation(pos9, { type: op2, value: value2 });
  
  const wrongAnswerPairs = generateWrongAnswerPairsPattern1(pos8, pos9, sequence, op1, value1, op2, value2);
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

function generatePattern2Safe() {
  // Safe fallback: use addition with geometric progression
  const operationType = '+';
  const zw1 = 10;
  const x = 4; // Geometric multiplier
  const start1 = 20;
  const start2 = 25;
  
  const sequence = [start1, start2];
  
  for (let i = 0; i < 5; i++) {
    const diff = zw1 * Math.pow(x, i);
    const next = applyOperation(sequence[i], { type: operationType, value: diff });
    sequence.push(next);
  }
  
  const diff5 = zw1 * Math.pow(x, 5);
  const diff6 = zw1 * Math.pow(x, 6);
  const pos8 = applyOperation(sequence[5], { type: operationType, value: diff5 });
  const pos9 = applyOperation(sequence[6], { type: operationType, value: diff6 });
  
  const wrongAnswerPairs = generateWrongAnswerPairsPattern2(pos8, pos9, sequence, operationType, zw1, x);
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
