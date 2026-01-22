// System 23: 3er-Sprung: Fibonacci: Dr2 + Dr1 = Dr3
// The differences between numbers 3 positions apart follow a Fibonacci sequence
// Example: 3, 12, 24, 40, 89, 138, 231
// Dr1 = Position 4 - Position 1 = 40 - 3 = 37
// Dr2 = Position 5 - Position 2 = 89 - 12 = 77
// Dr3 = Position 6 - Position 3 = 138 - 24 = 114
// Dr4 = Position 7 - Position 4 = 231 - 40 = 191
// Rule: Dr2 + Dr1 = Dr3 (77 + 37 = 114) ✓
// And: Dr3 + Dr2 = Dr4 (114 + 77 = 191) ✓

export function generateSystem23Task() {
  let attempts = 0;
  const maxAttempts = 20;
  
  while (attempts < maxAttempts) {
    try {
      const result = generateSequence();
      if (result && result.sequence && result.sequence.length === 7) {
        // Verify the Fibonacci rule
        const dr1 = result.sequence[3] - result.sequence[0];
        const dr2 = result.sequence[4] - result.sequence[1];
        const dr3 = result.sequence[5] - result.sequence[2];
        const dr4 = result.sequence[6] - result.sequence[3];
        
        // Verify Dr2 + Dr1 = Dr3
        if (dr2 + dr1 === dr3 && dr3 + dr2 === dr4) {
          return result;
        }
      }
    } catch (error) {
      // Continue to next attempt
    }
    attempts++;
  }
  
  // Fallback to safe pattern
  return generateSystem23Safe();
}

function generateSequence() {
  // Generate starting numbers for first 3 positions
  const start1 = Math.floor(Math.random() * 30) + 2; // 2-31
  const start2 = Math.floor(Math.random() * 30) + 2; // 2-31
  const start3 = Math.floor(Math.random() * 30) + 2; // 2-31
  
  // Build sequence
  const sequence = [start1, start2, start3];
  
  // Generate Dr1 and Dr2 (the first two differences in the Fibonacci sequence)
  const dr1 = Math.floor(Math.random() * 40) + 10; // 10-49
  const dr2 = Math.floor(Math.random() * 50) + 20; // 20-69
  
  // Calculate Dr3 using Fibonacci rule: Dr3 = Dr2 + Dr1
  const dr3 = dr2 + dr1;
  
  // Position 4: Position 1 + Dr1
  const pos4 = sequence[0] + dr1;
  if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
    throw new Error('Invalid position 4');
  }
  sequence.push(pos4);
  
  // Position 5: Position 2 + Dr2
  const pos5 = sequence[1] + dr2;
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: Position 3 + Dr3
  const pos6 = sequence[2] + dr3;
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Calculate Dr4 using Fibonacci rule: Dr4 = Dr3 + Dr2
  const dr4 = dr3 + dr2;
  
  // Position 7: Position 4 + Dr4
  const pos7 = sequence[3] + dr4;
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // Calculate Dr5 using Fibonacci rule: Dr5 = Dr4 + Dr3
  const dr5 = dr4 + dr3;
  
  // Position 8: Position 5 + Dr5
  const pos8 = sequence[4] + dr5;
  
  // Calculate Dr6 using Fibonacci rule: Dr6 = Dr5 + Dr4
  const dr6 = dr5 + dr4;
  
  // Position 9: Position 6 + Dr6
  const pos9 = sequence[5] + dr6;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    throw new Error('Invalid answer values');
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, dr1, dr2, dr3, dr4);
  
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, dr1, dr2, dr3, dr4) {
  const wrongPairs = new Set();
  let attempts = 0;
  const maxAttempts = 200;
  
  // Calculate correct Dr5 and Dr6 for reference
  const dr5 = dr4 + dr3;
  const dr6 = dr5 + dr4;
  
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
          // Use wrong Fibonacci calculation (e.g., Dr4 + Dr2 instead of Dr4 + Dr3)
          wrongPos8 = sequence[4] + (dr4 + dr2); // Wrong: should be dr4 + dr3
          wrongPos9 = sequence[5] + (dr5 + dr2); // Wrong: should be dr5 + dr4
          break;
        case 3:
          // Use constant difference instead of Fibonacci
          wrongPos8 = sequence[4] + dr4; // Wrong: using constant dr4
          wrongPos9 = sequence[5] + dr4; // Wrong: using constant dr4
          break;
        case 4:
          // Use wrong source position
          wrongPos8 = sequence[3] + dr5; // Wrong: using pos4 instead of pos5
          wrongPos9 = sequence[4] + dr6; // Wrong: using pos5 instead of pos6
          break;
        case 5:
          // Use subtraction instead of addition
          wrongPos8 = Math.abs(sequence[4] - dr5);
          wrongPos9 = Math.abs(sequence[5] - dr6);
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

function generateSystem23Safe() {
  // Safe fallback: use example values from the image
  // Sequence: 3, 12, 24, 40, 89, 138, 231
  // Dr1 = 37, Dr2 = 77, Dr3 = 114, Dr4 = 191
  
  const sequence = [3, 12, 24, 40, 89, 138, 231];
  const dr1 = 37;
  const dr2 = 77;
  const dr3 = 114;
  const dr4 = 191;
  
  // Calculate Dr5 and Dr6
  const dr5 = dr4 + dr3; // 191 + 114 = 305
  const dr6 = dr5 + dr4; // 305 + 191 = 496
  
  // Position 8: Position 5 + Dr5
  const pos8 = sequence[4] + dr5; // 89 + 305 = 394
  
  // Position 9: Position 6 + Dr6
  const pos9 = sequence[5] + dr6; // 138 + 496 = 634
  
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, dr1, dr2, dr3, dr4);
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
