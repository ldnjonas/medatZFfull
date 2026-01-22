// System 21: 1er-Sprung - Fibonacci: R3 + R1 = R5
// The differences between consecutive numbers (1er-Sprung) follow the rule: R3 + R1 = R5
// Where R1 is the 1st difference, R3 is the 3rd difference, and R5 is the 5th difference
// Example: 5, 8, 27, 64, 141, 181, 277
// Differences: +3, +19, +37, +77, +40, +96
// R1 = 3, R3 = 37, R5 = 40
// R3 + R1 = 37 + 3 = 40 = R5 ✓

export function generateSystem21Task() {
  let attempts = 0;
  const maxAttempts = 20;
  
  while (attempts < maxAttempts) {
    try {
      const result = generateSequence();
      if (result && result.sequence && result.sequence.length === 7) {
        // Verify the rule R3 + R1 = R5
        const differences = [];
        for (let i = 0; i < result.sequence.length - 1; i++) {
          differences.push(result.sequence[i + 1] - result.sequence[i]);
        }
        
        // R1 is 1st difference (index 0), R3 is 3rd difference (index 2), R5 is 5th difference (index 4)
        const r1 = differences[0];
        const r3 = differences[2];
        const r5 = differences[4];
        
        // Verify the rule holds
        if (r3 + r1 === r5) {
          return result;
        }
      }
    } catch (error) {
      // Continue to next attempt
    }
    attempts++;
  }
  
  // Fallback to safe pattern
  return generateSystem21Safe();
}

function generateSequence() {
  // Generate random starting number
  const start = Math.floor(Math.random() * 30) + 5; // 5-34
  
  // Generate differences that satisfy R3 + R1 = R5
  // We need 6 differences: D1, D2, D3, D4, D5, D6
  // Where D3 + D1 = D5 (R3 + R1 = R5)
  
  // Generate R1 (first difference) - random positive value
  const r1 = Math.floor(Math.random() * 20) + 2; // 2-21
  
  // Generate R3 (third difference) - random positive value
  const r3 = Math.floor(Math.random() * 50) + 10; // 10-59
  
  // Calculate R5 from the rule: R5 = R3 + R1
  const r5 = r3 + r1;
  
  // Generate other differences randomly
  const r2 = Math.floor(Math.random() * 30) + 5; // 5-34
  const r4 = Math.floor(Math.random() * 50) + 20; // 20-69
  const r6 = Math.floor(Math.random() * 50) + 30; // 30-79
  
  // Build the sequence using these differences
  const sequence = [start];
  
  // Position 2: start + R1
  const pos2 = start + r1;
  if (!Number.isInteger(pos2) || pos2 <= 0 || pos2 > 100000 || isNaN(pos2) || !isFinite(pos2)) {
    throw new Error('Invalid position 2');
  }
  sequence.push(pos2);
  
  // Position 3: pos2 + R2
  const pos3 = pos2 + r2;
  if (!Number.isInteger(pos3) || pos3 <= 0 || pos3 > 100000 || isNaN(pos3) || !isFinite(pos3)) {
    throw new Error('Invalid position 3');
  }
  sequence.push(pos3);
  
  // Position 4: pos3 + R3
  const pos4 = pos3 + r3;
  if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
    throw new Error('Invalid position 4');
  }
  sequence.push(pos4);
  
  // Position 5: pos4 + R4
  const pos5 = pos4 + r4;
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: pos5 + R5 (which equals R3 + R1)
  const pos6 = pos5 + r5;
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Position 7: pos6 + R6
  const pos7 = pos6 + r6;
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // To continue the pattern, we need to determine what comes next
  // Looking at the pattern, we can continue with a new difference
  // Let's use a pattern that maintains consistency
  
  // For position 8, we could continue with a new difference
  // One approach: use the average of recent differences or continue the pattern
  // Another approach: apply the same rule to the next set (R4 + R2 = R6, but we already have R6)
  // Or we could use a pattern based on the existing differences
  
  // Let's use a simpler approach: continue with a difference that follows a similar pattern
  // We'll generate a new difference for position 8
  const r7 = Math.floor(Math.random() * 50) + 30; // 30-79
  const pos8 = pos7 + r7;
  
  // For position 9, continue with another difference
  const r8 = Math.floor(Math.random() * 50) + 40; // 40-89
  const pos9 = pos8 + r8;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    throw new Error('Invalid answer values');
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, r1, r2, r3, r4, r5, r6);
  
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, r1, r2, r3, r4, r5, r6) {
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
          // Use wrong difference pattern (e.g., use R5 instead of R7)
          wrongPos8 = sequence[6] + r5;
          wrongPos9 = wrongPos8 + r6;
          break;
        case 3:
          // Use wrong rule (e.g., R4 + R2 instead of continuing pattern)
          wrongPos8 = sequence[6] + (r4 + r2);
          wrongPos9 = wrongPos8 + (Math.floor(Math.random() * 30) + 20);
          break;
        case 4:
          // Use wrong source position
          wrongPos8 = sequence[5] + r6;
          wrongPos9 = wrongPos8 + (Math.floor(Math.random() * 30) + 20);
          break;
        case 5:
          // Use subtraction instead of addition
          wrongPos8 = Math.abs(sequence[6] - r6);
          wrongPos9 = Math.abs(wrongPos8 - (Math.floor(Math.random() * 20) + 10));
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

function generateSystem21Safe() {
  // Safe fallback: use example values from the image
  // Sequence: 5, 8, 27, 64, 141, 181, 277
  // Differences: +3, +19, +37, +77, +40, +96
  // R1 = 3, R3 = 37, R5 = 40
  // R3 + R1 = 37 + 3 = 40 = R5 ✓
  
  const sequence = [5, 8, 27, 64, 141, 181, 277];
  
  // Continue the pattern: next difference could be similar to R6
  // Using a reasonable continuation
  const r7 = 100; // Continue with a similar difference
  const pos8 = sequence[6] + r7; // 277 + 100 = 377
  
  const r8 = 120;
  const pos9 = pos8 + r8; // 377 + 120 = 497
  
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, 3, 19, 37, 77, 40, 96);
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
