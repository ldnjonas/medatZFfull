// System 31: 3er-Sprung: Dr1, Dr1, Fibonacci (Z3 + Z4 = Z6)
// Pattern has three interleaved sub-sequences with 3-step jumps
// Sub-sequence 1 (Dr1): Position 1, 4, 7 - constant difference
// Sub-sequence 2 (Dr1): Position 2, 5, 8 - constant difference
// Sub-sequence 3 (Fibonacci): Position 3, 6, 9 - Fibonacci rule Z3 + Z4 = Z6
// Example: 13, 10, 23, 17, 14, 40, 21
// Position 1, 4, 7: 13, 17, 21 (Dr1: +4)
// Position 2, 5: 10, 14 (Dr1: +4)
// Position 3, 6: 23, 40 (Fibonacci: 23 + 17 = 40, where 17 = Z4)

export function generateSystem31Task() {
  let attempts = 0;
  const maxAttempts = 20;
  
  while (attempts < maxAttempts) {
    try {
      const result = generateSequence();
      if (result && result.sequence && result.sequence.length === 7) {
        // Verify the Fibonacci rule Z3 + Z4 = Z6
        const z3 = result.sequence[2];
        const z4 = result.sequence[3];
        const z6 = result.sequence[5];
        
        if (z3 + z4 === z6) {
          return result;
        }
      }
    } catch (error) {
      // Continue to next attempt
    }
    attempts++;
  }
  
  // Fallback to safe pattern
  return generateSystem31Safe();
}

function generateSequence() {
  // Generate starting numbers for first 3 positions
  const start1 = Math.floor(Math.random() * 30) + 5; // 5-34
  const start2 = Math.floor(Math.random() * 30) + 5; // 5-34
  const start3 = Math.floor(Math.random() * 30) + 10; // 10-39
  
  // Build sequence
  const sequence = [start1, start2, start3];
  
  // Generate Dr1 (constant difference for sub-sequences 1 and 2)
  const dr1Value = Math.floor(Math.random() * 20) + 2; // 2-21
  const dr1Op = { type: '+', value: dr1Value };
  
  // Position 4: Sub-sequence 1 (Position 1 + Dr1)
  const pos4 = applyOperation(sequence[0], dr1Op);
  if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
    throw new Error('Invalid position 4');
  }
  sequence.push(pos4);
  
  // Position 5: Sub-sequence 2 (Position 2 + Dr1)
  const pos5 = applyOperation(sequence[1], dr1Op);
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: Sub-sequence 3 (Fibonacci: Position 3 + Position 4)
  const pos6 = sequence[2] + sequence[3];
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Position 7: Sub-sequence 1 (Position 4 + Dr1)
  const pos7 = applyOperation(sequence[3], dr1Op);
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // Position 8: Sub-sequence 2 (Position 5 + Dr1)
  const pos8 = applyOperation(sequence[4], dr1Op);
  
  // Position 9: Sub-sequence 3 (Fibonacci: Position 6 + Position 7, continuing the pattern)
  // The pattern Z3 + Z4 = Z6 suggests that for position 9, we use Z6 + Z7 = Z9
  const pos9 = sequence[5] + sequence[6];
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    throw new Error('Invalid answer values');
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, dr1Op);
  
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, dr1Op) {
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
          // Use wrong Dr1 value for position 8
          const wrongDr1Value = dr1Op.value + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
          const wrongDr1Op = { type: dr1Op.type, value: wrongDr1Value };
          wrongPos8 = applyOperation(sequence[4], wrongDr1Op);
          wrongPos9 = sequence[5] + sequence[6];
          break;
        case 3:
          // Use wrong operation for position 8 (e.g., Fibonacci instead of Dr1)
          wrongPos8 = sequence[4] + sequence[5]; // Wrong: using Fibonacci instead of Dr1
          wrongPos9 = sequence[5] + sequence[6];
          break;
        case 4:
          // Use wrong source positions for Fibonacci
          wrongPos8 = applyOperation(sequence[4], dr1Op);
          wrongPos9 = sequence[4] + sequence[5]; // Wrong: using pos5 + pos6 instead of pos6 + pos7
          break;
        case 5:
          // Use subtraction instead of addition for Fibonacci
          wrongPos8 = applyOperation(sequence[4], dr1Op);
          wrongPos9 = Math.abs(sequence[5] - sequence[6]); // Wrong: subtraction instead of addition
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

function generateSystem31Safe() {
  // Safe fallback: use example values from the image
  // Sequence: 13, 10, 23, 17, 14, 40, 21
  // Sub-sequence 1 (Dr1): Position 1, 4, 7: 13, 17, 21 (Dr1: +4)
  // Sub-sequence 2 (Dr1): Position 2, 5: 10, 14 (Dr1: +4)
  // Sub-sequence 3 (Fibonacci): Position 3, 6: 23, 40 (Fibonacci: 23 + 17 = 40)
  
  const sequence = [13, 10, 23, 17, 14, 40, 21];
  const dr1Op = { type: '+', value: 4 };
  
  // Position 8: Sub-sequence 2 (Position 5 + Dr1)
  const pos8 = applyOperation(sequence[4], dr1Op); // 14 + 4 = 18
  
  // Position 9: Sub-sequence 3 (Fibonacci: Position 6 + Position 7)
  const pos9 = sequence[5] + sequence[6]; // 40 + 21 = 61
  
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, dr1Op);
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
