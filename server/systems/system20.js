// System 20: 1er-Sprung - 3-part cycle: Operation 1, Fibonacci, Operation 2, repeat
// Pattern: R1, Fibonacci, R2, R1, Fibonacci, R2, ... (or R2, Fibonacci, R1, R2, Fibonacci, R1, ...)
// Example: 9, 13, 22, 44, 48, 92, 184
// Position 1 → 2: R1 (+4): 9 + 4 = 13
// Position 1 + 2 → 3: Fibonacci: 9 + 13 = 22
// Position 3 → 4: R2 (x2): 22 * 2 = 44
// Position 4 → 5: R1 (+4): 44 + 4 = 48
// Position 4 + 5 → 6: Fibonacci: 44 + 48 = 92
// Position 6 → 7: R2 (x2): 92 * 2 = 184

export function generateSystem20Task() {
  // All 6 possible orders (3-part cycle):
  // 1. R1, Fibonacci, R2
  // 2. R2, Fibonacci, R1
  // 3. R1, R2, Fibonacci
  // 4. R2, R1, Fibonacci
  // 5. Fibonacci, R1, R2
  // 6. Fibonacci, R2, R1
  const orderIndex = Math.floor(Math.random() * 6);
  
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      const result = generatePatternWithOrder(orderIndex);
      if (result && result.sequence && result.sequence.length === 7) {
        return result;
      }
    } catch (error) {
      // Continue to next attempt
    }
    attempts++;
  }
  
  // If failed, try a different random order
  try {
    const altOrderIndex = Math.floor(Math.random() * 6);
    const result = generatePatternWithOrder(altOrderIndex);
    if (result && result.sequence && result.sequence.length === 7) {
      return result;
    }
  } catch (error) {
    // Fall through to safe pattern
  }
  
  // Final fallback to safe pattern
  return generateSystem20Safe();
}

function generatePatternWithOrder(orderIndex) {
  switch (orderIndex) {
    case 0:
      return generatePatternR1FibR2();
    case 1:
      return generatePatternR2FibR1();
    case 2:
      return generatePatternR1R2Fib();
    case 3:
      return generatePatternR2R1Fib();
    case 4:
      return generatePatternFibR1R2();
    case 5:
      return generatePatternFibR2R1();
    default:
      return generatePatternR1FibR2();
  }
}

// Pattern: R1, Fibonacci, R2, R1, Fibonacci, R2, ...
// Position 1 → 2: R1
// Position 1 + 2 → 3: Fibonacci
// Position 3 → 4: R2
// Position 4 → 5: R1
// Position 4 + 5 → 6: Fibonacci
// Position 6 → 7: R2
function generatePatternR1FibR2() {
  // Generate two random operations for R1 and R2
  const operations = ['+', '-', '*', '/'];
  const r1Type = operations[Math.floor(Math.random() * operations.length)];
  const r2Type = operations[Math.floor(Math.random() * operations.length)];
  
  // Generate values for R1 and R2
  let r1Value, r2Value;
  if (r1Type === '+' || r1Type === '-') {
    r1Value = Math.floor(Math.random() * 20) + 2; // 2-21
  } else if (r1Type === '*') {
    r1Value = Math.floor(Math.random() * 4) + 2; // 2-5
  } else { // division
    r1Value = Math.floor(Math.random() * 3) + 2; // 2-4
  }
  
  if (r2Type === '+' || r2Type === '-') {
    r2Value = Math.floor(Math.random() * 20) + 2; // 2-21
  } else if (r2Type === '*') {
    r2Value = Math.floor(Math.random() * 4) + 2; // 2-5
  } else { // division
    r2Value = Math.floor(Math.random() * 3) + 2; // 2-4
  }
  
  // Generate starting number
  const start = Math.floor(Math.random() * 30) + 5; // 5-34
  
  // Generate valid starting number
  const validStart = generateValidStart(start, r1Type, r1Value, r2Type, r2Value);
  
  // Build sequence
  const sequence = [validStart];
  
  // Position 2: Position 1 + R1
  const pos2 = applyOperation(sequence[0], { type: r1Type, value: r1Value });
  if (!Number.isInteger(pos2) || pos2 <= 0 || pos2 > 100000 || isNaN(pos2) || !isFinite(pos2)) {
    throw new Error('Invalid position 2');
  }
  sequence.push(pos2);
  
  // Position 3: Position 1 + Position 2 (Fibonacci)
  const pos3 = sequence[0] + sequence[1];
  if (!Number.isInteger(pos3) || pos3 <= 0 || pos3 > 100000 || isNaN(pos3) || !isFinite(pos3)) {
    throw new Error('Invalid position 3');
  }
  sequence.push(pos3);
  
  // Position 4: Position 3 + R2
  const pos4 = applyOperation(sequence[2], { type: r2Type, value: r2Value });
  if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
    throw new Error('Invalid position 4');
  }
  sequence.push(pos4);
  
  // Position 5: Position 4 + R1
  const pos5 = applyOperation(sequence[3], { type: r1Type, value: r1Value });
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: Position 4 + Position 5 (Fibonacci)
  const pos6 = sequence[3] + sequence[4];
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Position 7: Position 6 + R2
  const pos7 = applyOperation(sequence[5], { type: r2Type, value: r2Value });
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // Position 8: Position 7 + R1
  const pos8 = applyOperation(sequence[6], { type: r1Type, value: r1Value });
  
  // Position 9: Position 7 + Position 8 (Fibonacci)
  const pos9 = sequence[6] + pos8;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    throw new Error('Invalid answer values');
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, r1Type, r1Value, r2Type, r2Value, 'r1fibr2');
  
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

// Pattern: R2, Fibonacci, R1, R2, Fibonacci, R1, ...
// Position 1 → 2: R2
// Position 1 + 2 → 3: Fibonacci
// Position 3 → 4: R1
// Position 4 → 5: R2
// Position 4 + 5 → 6: Fibonacci
// Position 6 → 7: R1
function generatePatternR2FibR1() {
  // Generate two random operations for R1 and R2
  const operations = ['+', '-', '*', '/'];
  const r1Type = operations[Math.floor(Math.random() * operations.length)];
  const r2Type = operations[Math.floor(Math.random() * operations.length)];
  
  // Generate values for R1 and R2
  let r1Value, r2Value;
  if (r1Type === '+' || r1Type === '-') {
    r1Value = Math.floor(Math.random() * 20) + 2; // 2-21
  } else if (r1Type === '*') {
    r1Value = Math.floor(Math.random() * 4) + 2; // 2-5
  } else { // division
    r1Value = Math.floor(Math.random() * 3) + 2; // 2-4
  }
  
  if (r2Type === '+' || r2Type === '-') {
    r2Value = Math.floor(Math.random() * 20) + 2; // 2-21
  } else if (r2Type === '*') {
    r2Value = Math.floor(Math.random() * 4) + 2; // 2-5
  } else { // division
    r2Value = Math.floor(Math.random() * 3) + 2; // 2-4
  }
  
  // Generate starting number
  const start = Math.floor(Math.random() * 30) + 5; // 5-34
  
  // Generate valid starting number
  const validStart = generateValidStart(start, r1Type, r1Value, r2Type, r2Value);
  
  // Build sequence
  const sequence = [validStart];
  
  // Position 2: Position 1 + R2
  const pos2 = applyOperation(sequence[0], { type: r2Type, value: r2Value });
  if (!Number.isInteger(pos2) || pos2 <= 0 || pos2 > 100000 || isNaN(pos2) || !isFinite(pos2)) {
    throw new Error('Invalid position 2');
  }
  sequence.push(pos2);
  
  // Position 3: Position 1 + Position 2 (Fibonacci)
  const pos3 = sequence[0] + sequence[1];
  if (!Number.isInteger(pos3) || pos3 <= 0 || pos3 > 100000 || isNaN(pos3) || !isFinite(pos3)) {
    throw new Error('Invalid position 3');
  }
  sequence.push(pos3);
  
  // Position 4: Position 3 + R1
  const pos4 = applyOperation(sequence[2], { type: r1Type, value: r1Value });
  if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
    throw new Error('Invalid position 4');
  }
  sequence.push(pos4);
  
  // Position 5: Position 4 + R2
  const pos5 = applyOperation(sequence[3], { type: r2Type, value: r2Value });
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: Position 4 + Position 5 (Fibonacci)
  const pos6 = sequence[3] + sequence[4];
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Position 7: Position 6 + R1
  const pos7 = applyOperation(sequence[5], { type: r1Type, value: r1Value });
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // Position 8: Position 7 + R2
  const pos8 = applyOperation(sequence[6], { type: r2Type, value: r2Value });
  
  // Position 9: Position 7 + Position 8 (Fibonacci)
  const pos9 = sequence[6] + pos8;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    throw new Error('Invalid answer values');
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, r1Type, r1Value, r2Type, r2Value, 'r2fibr1');
  
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


function generateValidStart(start, r1Type, r1Value, r2Type, r2Value) {
  // Collect divisors
  const divisors = [];
  if (r1Type === '/') divisors.push(r1Value);
  if (r2Type === '/') divisors.push(r2Value);
  
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
      // Position 2: R1
      let pos2 = applyOperation(testSequence[0], { type: r1Type, value: r1Value });
      if (!Number.isInteger(pos2) || pos2 <= 0 || pos2 > 100000 || isNaN(pos2) || !isFinite(pos2)) {
        valid = false;
      } else {
        testSequence.push(pos2);
        
        // Position 3: Fibonacci
        const pos3 = testSequence[0] + testSequence[1];
        if (!Number.isInteger(pos3) || pos3 <= 0 || pos3 > 100000 || isNaN(pos3) || !isFinite(pos3)) {
          valid = false;
        } else {
          testSequence.push(pos3);
          
          // Position 4: R2
          let pos4 = applyOperation(testSequence[2], { type: r2Type, value: r2Value });
          if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
            valid = false;
          } else {
            testSequence.push(pos4);
            
            // Position 5: R1
            let pos5 = applyOperation(testSequence[3], { type: r1Type, value: r1Value });
            if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
              valid = false;
            } else {
              testSequence.push(pos5);
              
              // Position 6: Fibonacci
              const pos6 = testSequence[3] + testSequence[4];
              if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
                valid = false;
              } else {
                testSequence.push(pos6);
                
                // Position 7: R2
                let pos7 = applyOperation(testSequence[5], { type: r2Type, value: r2Value });
                if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
                  valid = false;
                } else {
                  testSequence.push(pos7);
                  
                  // Position 8: R1
                  let pos8 = applyOperation(testSequence[6], { type: r1Type, value: r1Value });
                  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8)) {
                    valid = false;
                  } else {
                    // Position 9: Fibonacci
                    const pos9 = testSequence[6] + pos8;
                    if (!Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
                      valid = false;
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
  
  if (!valid) {
    if (divisors.length > 0) {
      s = lcm * 20;
    } else {
      s = 20;
    }
  }
  
  return s;
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, r1Type, r1Value, r2Type, r2Value, patternType) {
  // Determine which operation should be used for position 8 based on pattern
  let correctOpType, correctOpValue, wrongOpType, wrongOpValue;
  if (patternType === 'r1fibr2' || patternType === 'r1r2fib' || patternType === 'fibr1r2') {
    // Position 8 uses R1
    correctOpType = r1Type;
    correctOpValue = r1Value;
    wrongOpType = r2Type;
    wrongOpValue = r2Value;
  } else {
    // Position 8 uses R2 (patternType === 'r2fibr1' || 'r2r1fib' || 'fibr2r1')
    correctOpType = r2Type;
    correctOpValue = r2Value;
    wrongOpType = r1Type;
    wrongOpValue = r1Value;
  }
  
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
          // Use wrong operation for position 8
          wrongPos8 = applyOperation(sequence[6], { type: wrongOpType, value: wrongOpValue });
          wrongPos9 = sequence[6] + wrongPos8;
          break;
        case 3:
          // Use wrong value
          wrongPos8 = applyOperation(sequence[6], { type: correctOpType, value: correctOpValue + 1 });
          wrongPos9 = sequence[6] + wrongPos8;
          break;
        case 4:
          // Use wrong source position
          wrongPos8 = applyOperation(sequence[5], { type: correctOpType, value: correctOpValue });
          wrongPos9 = sequence[5] + wrongPos8;
          break;
        case 5:
          // Use subtraction instead of addition for Fibonacci
          wrongPos8 = applyOperation(sequence[6], { type: correctOpType, value: correctOpValue });
          wrongPos9 = Math.abs(sequence[6] - wrongPos8);
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

function generateSystem20Safe() {
  // Safe fallback: use standard pattern with example values
  const r1Type = '+';
  const r1Value = 4;
  const r2Type = '*';
  const r2Value = 2;
  const start = 9;
  
  const sequence = [start];
  sequence.push(applyOperation(sequence[0], { type: r1Type, value: r1Value })); // 13
  sequence.push(sequence[0] + sequence[1]); // 22
  sequence.push(applyOperation(sequence[2], { type: r2Type, value: r2Value })); // 44
  sequence.push(applyOperation(sequence[3], { type: r1Type, value: r1Value })); // 48
  sequence.push(sequence[3] + sequence[4]); // 92
  sequence.push(applyOperation(sequence[5], { type: r2Type, value: r2Value })); // 184
  
  const pos8 = applyOperation(sequence[6], { type: r1Type, value: r1Value });
  const pos9 = sequence[6] + pos8;
  
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, r1Type, r1Value, r2Type, r2Value, 'standard');
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
