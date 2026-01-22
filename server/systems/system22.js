// System 22: 1er-Sprung: R1 + Fibonacci: Z3 + Z2 + Z1 = Z4
// Pattern alternates between:
// 1. 1er-Sprung: R1 (e.g., +4)
// 2. Fibonacci: Z3 + Z2 + Z1 = Z4 (sum of three previous relevant numbers)
// Example: 2, 6, 17, 21, 44, 48, 113
// Position 1 → 2: R1 (+4): 2 + 4 = 6
// Position 3: new base number: 17
// Position 3 → 4: R1 (+4): 17 + 4 = 21
// Position 5: Fibonacci: 6 + 17 + 21 = 44
// Position 5 → 6: R1 (+4): 44 + 4 = 48
// Position 7: Fibonacci: 21 + 44 + 48 = 113

export function generateSystem22Task() {
  // Randomly choose between different pattern orders
  const patternType = Math.floor(Math.random() * 2); // 0 = R1 first, 1 = Fibonacci first
  
  let attempts = 0;
  const maxAttempts = 20;
  
  while (attempts < maxAttempts) {
    try {
      let result;
      if (patternType === 0) {
        // Pattern: R1 first, then Fibonacci
        result = generateSequenceR1First();
      } else {
        // Pattern: Fibonacci first, then R1
        result = generateSequenceFibFirst();
      }
      
      if (result && result.sequence && result.sequence.length === 7) {
        return result;
      }
    } catch (error) {
      // Continue to next attempt
    }
    attempts++;
  }
  
  // If the chosen pattern failed, try the other one
  try {
    let result;
    if (patternType === 0) {
      result = generateSequenceFibFirst();
    } else {
      result = generateSequenceR1First();
    }
    
    if (result && result.sequence && result.sequence.length === 7) {
      return result;
    }
  } catch (error) {
    // Fall through to safe pattern
  }
  
  // Fallback to safe pattern
  return generateSystem22Safe();
}

// Pattern 1: R1 first, then Fibonacci
// Example: 2, 6, 17, 21, 44, 48, 113
// Position 1 → 2: R1 (+4): 2 + 4 = 6
// Position 3: new base number: 17
// Position 3 → 4: R1 (+4): 17 + 4 = 21
// Position 5: Fibonacci: 6 + 17 + 21 = 44
// Position 5 → 6: R1 (+4): 44 + 4 = 48
// Position 7: Fibonacci: 21 + 44 + 48 = 113
function generateSequenceR1First() {
  // Generate random R1 value (the 1er-Sprung operation)
  const r1 = Math.floor(Math.random() * 15) + 2; // 2-16
  
  // Generate starting number
  const start = Math.floor(Math.random() * 30) + 2; // 2-31
  
  // Build sequence
  const sequence = [start];
  
  // Position 2: Position 1 + R1 (1er-Sprung)
  const pos2 = sequence[0] + r1;
  if (!Number.isInteger(pos2) || pos2 <= 0 || pos2 > 100000 || isNaN(pos2) || !isFinite(pos2)) {
    throw new Error('Invalid position 2');
  }
  sequence.push(pos2);
  
  // Position 3: new base number (should be different from pos2, typically larger)
  const pos3 = Math.floor(Math.random() * 30) + Math.max(sequence[1] + 5, 10); // Ensure it's reasonably larger
  if (!Number.isInteger(pos3) || pos3 <= 0 || pos3 > 100000 || isNaN(pos3) || !isFinite(pos3)) {
    throw new Error('Invalid position 3');
  }
  sequence.push(pos3);
  
  // Position 4: Position 3 + R1 (1er-Sprung)
  const pos4 = sequence[2] + r1;
  if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
    throw new Error('Invalid position 4');
  }
  sequence.push(pos4);
  
  // Position 5: Fibonacci: Position 2 + Position 3 + Position 4
  const pos5 = sequence[1] + sequence[2] + sequence[3];
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: Position 5 + R1 (1er-Sprung)
  const pos6 = sequence[4] + r1;
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Position 7: Fibonacci: Position 4 + Position 5 + Position 6
  const pos7 = sequence[3] + sequence[4] + sequence[5];
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // Position 8: Position 7 + R1 (1er-Sprung)
  const pos8 = sequence[6] + r1;
  
  // Position 9: Fibonacci: Position 6 + Position 7 + Position 8
  const pos9 = sequence[5] + sequence[6] + pos8;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    throw new Error('Invalid answer values');
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, r1);
  
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

// Pattern 2: Fibonacci first, then R1
// Example: 3, 5, 7, 15, 19, 41, 45
// Position 1, 2, 3: initial numbers (3, 5, 7)
// Position 4: Fibonacci: 3 + 5 + 7 = 15
// Position 4 → 5: R1 (+4): 15 + 4 = 19
// Position 6: Fibonacci: 5 + 7 + 15 = 27, but wait... let me think about this pattern
// Actually, a better pattern:
// Position 1, 2, 3: initial numbers
// Position 4: Fibonacci: Z1 + Z2 + Z3 = Z4
// Position 4 → 5: R1: Z4 + R1 = Z5
// Position 6: Fibonacci: Z2 + Z3 + Z4 = Z6 (or Z3 + Z4 + Z5)
// Position 6 → 7: R1: Z6 + R1 = Z7

function generateSequenceFibFirst() {
  // Generate random R1 value (the 1er-Sprung operation)
  const r1 = Math.floor(Math.random() * 15) + 2; // 2-16
  
  // Generate three starting numbers for Fibonacci
  const start1 = Math.floor(Math.random() * 20) + 2; // 2-21
  const start2 = Math.floor(Math.random() * 20) + 2; // 2-21
  const start3 = Math.floor(Math.random() * 20) + 2; // 2-21
  
  // Build sequence
  const sequence = [start1, start2, start3];
  
  // Position 4: Fibonacci: Position 1 + Position 2 + Position 3
  const pos4 = sequence[0] + sequence[1] + sequence[2];
  if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
    throw new Error('Invalid position 4');
  }
  sequence.push(pos4);
  
  // Position 5: Position 4 + R1 (1er-Sprung)
  const pos5 = sequence[3] + r1;
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: Fibonacci: Position 2 + Position 3 + Position 4
  const pos6 = sequence[1] + sequence[2] + sequence[3];
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Position 7: Position 6 + R1 (1er-Sprung)
  const pos7 = sequence[5] + r1;
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // Position 8: Fibonacci: Position 4 + Position 5 + Position 6
  const pos8 = sequence[3] + sequence[4] + sequence[5];
  
  // Position 9: Position 8 + R1 (1er-Sprung)
  const pos9 = pos8 + r1;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    throw new Error('Invalid answer values');
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairsFibFirst(pos8, pos9, sequence, r1);
  
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

function generateWrongAnswerPairsFibFirst(correctPos8, correctPos9, sequence, r1) {
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
          // Use wrong Fibonacci pattern (only 2 numbers instead of 3)
          wrongPos8 = sequence[4] + sequence[5]; // Only 2 numbers instead of 3
          wrongPos9 = wrongPos8 + r1;
          break;
        case 3:
          // Use wrong source positions for Fibonacci
          wrongPos8 = sequence[2] + sequence[3] + sequence[4]; // Wrong positions
          wrongPos9 = wrongPos8 + r1;
          break;
        case 4:
          // Use wrong R1 value for position 9
          wrongPos8 = sequence[3] + sequence[4] + sequence[5];
          wrongPos9 = wrongPos8 + (r1 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1));
          break;
        case 5:
          // Use subtraction instead of addition
          wrongPos8 = Math.abs(sequence[3] - sequence[4] - sequence[5]);
          wrongPos9 = Math.abs(wrongPos8 - r1);
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, r1) {
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
          // Use wrong R1 value for position 8
          wrongPos8 = sequence[6] + (r1 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1));
          wrongPos9 = sequence[5] + sequence[6] + wrongPos8;
          break;
        case 3:
          // Use wrong Fibonacci pattern (only 2 numbers instead of 3)
          wrongPos8 = sequence[6] + r1;
          wrongPos9 = sequence[6] + wrongPos8; // Only 2 numbers instead of 3
          break;
        case 4:
          // Use wrong source positions for Fibonacci
          wrongPos8 = sequence[6] + r1;
          wrongPos9 = sequence[4] + sequence[5] + wrongPos8; // Wrong: using pos5, pos6, pos8 instead of pos6, pos7, pos8
          break;
        case 5:
          // Use subtraction instead of addition
          wrongPos8 = Math.abs(sequence[6] - r1);
          wrongPos9 = Math.abs(sequence[5] - sequence[6] - wrongPos8);
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

function generateSystem22Safe() {
  // Safe fallback: use example values from the image
  // Sequence: 2, 6, 17, 21, 44, 48, 113
  // R1 = +4
  // Pattern: +4, new base, +4, Fibonacci (sum of 3), +4, Fibonacci (sum of 3)
  
  const sequence = [2, 6, 17, 21, 44, 48, 113];
  const r1 = 4;
  
  // Position 8: Position 7 + R1
  const pos8 = sequence[6] + r1; // 113 + 4 = 117
  
  // Position 9: Fibonacci: Position 6 + Position 7 + Position 8
  const pos9 = sequence[5] + sequence[6] + pos8; // 48 + 113 + 117 = 278
  
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, r1);
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
