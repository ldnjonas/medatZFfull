// System 18: Fibonacci pattern with multiplication
// Odd positions (1, 3, 5, 7): Fibonacci-like: Z3 = Z1 + Z2, Z5 = Z3 + Z4, Z7 = Z5 + Z6
// Even positions (2, 4, 6): Multiplication: Z4 = Z2 * multiplier, Z6 = Z4 * multiplier
// Example: 13, 24, 37, 96, 133, 384, 517
// Z3 = Z1 + Z2 = 13 + 24 = 37
// Z4 = Z2 * 4 = 24 * 4 = 96
// Z5 = Z3 + Z4 = 37 + 96 = 133
// Z6 = Z4 * 4 = 96 * 4 = 384
// Z7 = Z5 + Z6 = 133 + 384 = 517

import { MAX_POSITION_VALUE } from '../config.js';

export function generateSystem18Task() {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      // Randomly choose between standard and reverse pattern
      const useStandard = Math.random() > 0.5;
      
      if (useStandard) {
        // Standard: Fibonacci for odd, multiplication for even
        return generateStandardPattern();
      } else {
        // Reverse: Fibonacci for even, multiplication for odd
        return generateReversePattern();
      }
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        // Fallback to safe pattern
        return generateSystem18Safe();
      }
    }
  }
  
  return generateSystem18Safe();
}

// Standard pattern: Fibonacci for odd positions, multiplication for even positions
function generateStandardPattern() {
  // Generate starting numbers for positions 1 and 2
  const start1 = Math.floor(Math.random() * 30) + 5; // 5-34
  const start2 = Math.floor(Math.random() * 30) + 5; // 5-34
  
  // Generate multiplier for even positions
  const multiplier = Math.floor(Math.random() * 4) + 2; // 2-5
  
  // Build sequence
  const sequence = [start1, start2];
  
  // Position 3: Fibonacci (Z1 + Z2)
  const pos3 = sequence[0] + sequence[1];
  if (!Number.isInteger(pos3) || pos3 <= 0 || pos3 > 100000 || isNaN(pos3) || !isFinite(pos3)) {
    throw new Error('Invalid position 3');
  }
  sequence.push(pos3);
  
  // Position 4: Multiplication (Z2 * multiplier)
  const pos4 = sequence[1] * multiplier;
  if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
    throw new Error('Invalid position 4');
  }
  sequence.push(pos4);
  
  // Position 5: Fibonacci (Z3 + Z4)
  const pos5 = sequence[2] + sequence[3];
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: Multiplication (Z4 * multiplier)
  const pos6 = sequence[3] * multiplier;
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Position 7: Fibonacci (Z5 + Z6)
  const pos7 = sequence[4] + sequence[5];
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // Position 8: Multiplication (Z6 * multiplier) - next even position
  const pos8 = sequence[5] * multiplier;
  
  // Position 9: Fibonacci (Z7 + Z8) - next odd position
  const pos9 = sequence[6] + pos8;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > MAX_POSITION_VALUE || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > MAX_POSITION_VALUE || isNaN(pos9) || !isFinite(pos9)) {
    throw new Error('Invalid answer values');
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, multiplier, 'standard');
  
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

// Reverse pattern: Fibonacci for even positions, multiplication for odd positions
function generateReversePattern() {
  // Generate starting numbers for positions 1 and 2
  const start1 = Math.floor(Math.random() * 30) + 5; // 5-34
  const start2 = Math.floor(Math.random() * 30) + 5; // 5-34
  
  // Generate multiplier for odd positions
  const multiplier = Math.floor(Math.random() * 4) + 2; // 2-5
  
  // Build sequence
  const sequence = [start1, start2];
  
  // Position 3: Multiplication (Z1 * multiplier)
  const pos3 = sequence[0] * multiplier;
  if (!Number.isInteger(pos3) || pos3 <= 0 || pos3 > 100000 || isNaN(pos3) || !isFinite(pos3)) {
    throw new Error('Invalid position 3');
  }
  sequence.push(pos3);
  
  // Position 4: Fibonacci (Z2 + Z3)
  const pos4 = sequence[1] + sequence[2];
  if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
    throw new Error('Invalid position 4');
  }
  sequence.push(pos4);
  
  // Position 5: Multiplication (Z3 * multiplier)
  const pos5 = sequence[2] * multiplier;
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: Fibonacci (Z4 + Z5)
  const pos6 = sequence[3] + sequence[4];
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Position 7: Multiplication (Z5 * multiplier)
  const pos7 = sequence[4] * multiplier;
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // Position 8: Fibonacci (Z6 + Z7) - next even position
  const pos8 = sequence[5] + sequence[6];
  
  // Position 9: Multiplication (Z7 * multiplier) - next odd position
  const pos9 = sequence[6] * multiplier;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > MAX_POSITION_VALUE || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > MAX_POSITION_VALUE || isNaN(pos9) || !isFinite(pos9)) {
    throw new Error('Invalid answer values');
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, multiplier, 'reverse');
  
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


function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, multiplier, patternType) {
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
          // Use wrong pattern
          if (patternType === 'standard') {
            // Use reverse pattern
            wrongPos8 = sequence[5] + sequence[6];
            wrongPos9 = sequence[6] * (multiplier || 2);
          } else if (patternType === 'reverse') {
            // Use standard pattern
            wrongPos8 = sequence[5] * (multiplier || 2);
            wrongPos9 = sequence[6] + wrongPos8;
          } else {
            wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
            wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          }
          break;
        case 3:
          // Use wrong multiplier
          if (multiplier) {
            const wrongMult = multiplier + (Math.random() > 0.5 ? 1 : -1);
            if (patternType === 'standard') {
              wrongPos8 = sequence[5] * wrongMult;
              wrongPos9 = sequence[6] + wrongPos8;
            } else if (patternType === 'reverse') {
              wrongPos8 = sequence[5] + sequence[6];
              wrongPos9 = sequence[6] * wrongMult;
            } else {
              wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
              wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
            }
          } else {
            wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
            wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          }
          break;
        case 4:
          // Use wrong source positions
          if (patternType === 'standard') {
            wrongPos8 = sequence[4] * (multiplier || 2);
            wrongPos9 = sequence[5] + wrongPos8;
          } else if (patternType === 'reverse') {
            wrongPos8 = sequence[4] + sequence[5];
            wrongPos9 = sequence[5] * (multiplier || 2);
          } else {
            wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
            wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          }
          break;
        case 5:
          // Use subtraction instead of addition for Fibonacci
          if (patternType === 'standard' || patternType === 'reverse') {
            wrongPos8 = Math.abs(sequence[5] - sequence[6]);
            wrongPos9 = Math.abs(sequence[6] - wrongPos8);
          } else {
            wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
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

function generateSystem18Safe() {
  // Safe fallback: use standard pattern with example values
  const start1 = 13;
  const start2 = 24;
  const multiplier = 4;
  
  const sequence = [start1, start2];
  sequence.push(sequence[0] + sequence[1]); // 37
  sequence.push(sequence[1] * multiplier); // 96
  sequence.push(sequence[2] + sequence[3]); // 133
  sequence.push(sequence[3] * multiplier); // 384
  sequence.push(sequence[4] + sequence[5]); // 517
  
  const pos8 = sequence[5] * multiplier; // 1536
  const pos9 = sequence[6] + pos8; // 2053
  
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, multiplier, 'standard');
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
