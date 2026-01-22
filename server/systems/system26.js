// System 26: Fibonacci: Z1 + Z3 = Z5 // Z2 + Z4 = Z6 // Z3 + Z5 = Z7 ...
// Pattern: Z_i + Z_{i+2} = Z_{i+4}
// Each term is the sum of a term two positions before and another term two positions before that
// Example: 10, 2, 3, 2, 13, 4, 16
// Z1 (10) + Z3 (3) = Z5 (13) ✓
// Z2 (2) + Z4 (2) = Z6 (4) ✓
// Z3 (3) + Z5 (13) = Z7 (16) ✓

export function generateSystem26Task() {
  let attempts = 0;
  const maxAttempts = 20;
  
  while (attempts < maxAttempts) {
    try {
      const result = generateSequence();
      if (result && result.sequence && result.sequence.length === 7) {
        // Verify the Fibonacci rule
        const z1 = result.sequence[0];
        const z2 = result.sequence[1];
        const z3 = result.sequence[2];
        const z4 = result.sequence[3];
        const z5 = result.sequence[4];
        const z6 = result.sequence[5];
        const z7 = result.sequence[6];
        
        // Verify Z1 + Z3 = Z5, Z2 + Z4 = Z6, Z3 + Z5 = Z7
        if (z1 + z3 === z5 && z2 + z4 === z6 && z3 + z5 === z7) {
          return result;
        }
      }
    } catch (error) {
      // Continue to next attempt
    }
    attempts++;
  }
  
  // Fallback to safe pattern
  return generateSystem26Safe();
}

function generateSequence() {
  // Generate starting numbers for first 4 positions
  const start1 = Math.floor(Math.random() * 20) + 2; // 2-21
  const start2 = Math.floor(Math.random() * 20) + 2; // 2-21
  const start3 = Math.floor(Math.random() * 20) + 2; // 2-21
  const start4 = Math.floor(Math.random() * 20) + 2; // 2-21
  
  // Build sequence
  const sequence = [start1, start2, start3, start4];
  
  // Position 5: Z1 + Z3 (Position 1 + Position 3)
  const pos5 = sequence[0] + sequence[2];
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: Z2 + Z4 (Position 2 + Position 4)
  const pos6 = sequence[1] + sequence[3];
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Position 7: Z3 + Z5 (Position 3 + Position 5)
  const pos7 = sequence[2] + sequence[4];
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // Position 8: Z4 + Z6 (Position 4 + Position 6)
  const pos8 = sequence[3] + sequence[5];
  
  // Position 9: Z5 + Z7 (Position 5 + Position 7)
  const pos9 = sequence[4] + sequence[6];
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    throw new Error('Invalid answer values');
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence);
  
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence) {
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
          // Use wrong Fibonacci pattern (e.g., Z3 + Z6 instead of Z4 + Z6)
          wrongPos8 = sequence[2] + sequence[5]; // Wrong: Z3 + Z6 instead of Z4 + Z6
          wrongPos9 = sequence[4] + sequence[6]; // Correct for pos9
          break;
        case 3:
          // Use wrong positions for both
          wrongPos8 = sequence[2] + sequence[4]; // Wrong: Z3 + Z5 instead of Z4 + Z6
          wrongPos9 = sequence[3] + sequence[5]; // Wrong: Z4 + Z6 instead of Z5 + Z7
          break;
        case 4:
          // Use only one number instead of sum
          wrongPos8 = sequence[3]; // Wrong: only Z4 instead of Z4 + Z6
          wrongPos9 = sequence[4]; // Wrong: only Z5 instead of Z5 + Z7
          break;
        case 5:
          // Use subtraction instead of addition
          wrongPos8 = Math.abs(sequence[3] - sequence[5]);
          wrongPos9 = Math.abs(sequence[4] - sequence[6]);
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

function generateSystem26Safe() {
  // Safe fallback: use example values from the image
  // Sequence: 10, 2, 3, 2, 13, 4, 16
  // Z1 (10) + Z3 (3) = Z5 (13) ✓
  // Z2 (2) + Z4 (2) = Z6 (4) ✓
  // Z3 (3) + Z5 (13) = Z7 (16) ✓
  
  const sequence = [10, 2, 3, 2, 13, 4, 16];
  
  // Position 8: Z4 + Z6 (Position 4 + Position 6)
  const pos8 = sequence[3] + sequence[5]; // 2 + 4 = 6
  
  // Position 9: Z5 + Z7 (Position 5 + Position 7)
  const pos9 = sequence[4] + sequence[6]; // 13 + 16 = 29
  
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence);
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
