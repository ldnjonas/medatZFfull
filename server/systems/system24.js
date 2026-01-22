// System 24: Fibonacci: Z4 + Z3 + Z2 + Z1 = Z5
// Each number (starting from the 5th) is the sum of the four preceding numbers
// Example: 5, 9, 19, 25, 58, 111, 213
// Position 5 (58) = 5 + 9 + 19 + 25 = 58
// Position 6 (111) = 9 + 19 + 25 + 58 = 111
// Position 7 (213) = 19 + 25 + 58 + 111 = 213

export function generateSystem24Task() {
  let attempts = 0;
  const maxAttempts = 20;
  
  while (attempts < maxAttempts) {
    try {
      const result = generateSequence();
      if (result && result.sequence && result.sequence.length === 7) {
        return result;
      }
    } catch (error) {
      // Continue to next attempt
    }
    attempts++;
  }
  
  // Fallback to safe pattern
  return generateSystem24Safe();
}

function generateSequence() {
  // Generate four starting numbers
  const start1 = Math.floor(Math.random() * 20) + 2; // 2-21
  const start2 = Math.floor(Math.random() * 20) + 2; // 2-21
  const start3 = Math.floor(Math.random() * 20) + 2; // 2-21
  const start4 = Math.floor(Math.random() * 20) + 2; // 2-21
  
  // Build the sequence of 7 numbers
  const sequence = [start1, start2, start3, start4];
  
  // Position 5: sum of positions 1, 2, 3, 4
  const pos5 = sequence[0] + sequence[1] + sequence[2] + sequence[3];
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: sum of positions 2, 3, 4, 5
  const pos6 = sequence[1] + sequence[2] + sequence[3] + sequence[4];
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Position 7: sum of positions 3, 4, 5, 6
  const pos7 = sequence[2] + sequence[3] + sequence[4] + sequence[5];
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // Position 8: sum of positions 4, 5, 6, 7
  const pos8 = sequence[3] + sequence[4] + sequence[5] + sequence[6];
  
  // Position 9: sum of positions 5, 6, 7, 8
  const pos9 = sequence[4] + sequence[5] + sequence[6] + pos8;
  
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
          wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 30) + 10);
          wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 50) + 20);
          break;
        case 1:
          // First position correct, second wrong
          wrongPos8 = correctPos8;
          wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 40) + 15);
          break;
        case 2:
          // First position wrong, second follows pattern from wrong first
          wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 30) + 10);
          wrongPos9 = sequence[4] + sequence[5] + sequence[6] + wrongPos8; // Pattern: pos5 + pos6 + pos7 + pos8
          break;
        case 3:
          // Use wrong combination (e.g., only 3 numbers instead of 4)
          wrongPos8 = sequence[4] + sequence[5] + sequence[6]; // Wrong: only 3 numbers instead of 4
          wrongPos9 = sequence[5] + sequence[6] + wrongPos8; // Wrong: only 3 numbers instead of 4
          break;
        case 4:
          // Use wrong positions for position 8
          wrongPos8 = sequence[2] + sequence[3] + sequence[4] + sequence[5]; // Wrong: pos3 + pos4 + pos5 + pos6 instead of pos4 + pos5 + pos6 + pos7
          wrongPos9 = sequence[4] + sequence[5] + sequence[6] + wrongPos8;
          break;
        case 5:
          // Use wrong positions for position 9
          wrongPos8 = sequence[3] + sequence[4] + sequence[5] + sequence[6];
          wrongPos9 = sequence[3] + sequence[5] + sequence[6] + wrongPos8; // Wrong: pos4 + pos6 + pos7 + pos8 instead of pos5 + pos6 + pos7 + pos8
          break;
      }
      
      wrongPos8 = Math.max(1, Math.round(wrongPos8));
      wrongPos9 = Math.max(1, Math.round(wrongPos9));
      
      const isTooSimilar = Math.abs(wrongPos8 - correctPos8) < 10 && Math.abs(wrongPos9 - correctPos9) < 20;
      
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
    const offset8 = (wrongPairs.size + 1) * 10;
    const offset9 = (wrongPairs.size + 1) * 20;
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
    const offset8 = (validWrongPairs.length + 1) * 10;
    const offset9 = (validWrongPairs.length + 1) * 20;
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

function generateSystem24Safe() {
  // Safe fallback: use example values from the image
  // Sequence: 5, 9, 19, 25, 58, 111, 213
  
  const sequence = [5, 9, 19, 25, 58, 111, 213];
  
  // Position 8: Position 4 + Position 5 + Position 6 + Position 7
  const pos8 = sequence[3] + sequence[4] + sequence[5] + sequence[6]; // 25 + 58 + 111 + 213 = 407
  
  // Position 9: Position 5 + Position 6 + Position 7 + Position 8
  const pos9 = sequence[4] + sequence[5] + sequence[6] + pos8; // 58 + 111 + 213 + 407 = 789
  
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
