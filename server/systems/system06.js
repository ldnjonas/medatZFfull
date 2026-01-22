// System 06: Fibonacci sequence
// Each number is the sum of the two preceding numbers
// Z(n) = Z(n-1) + Z(n-2)
// Example: 8, 10, 18, 28, 46, 74, 120
// 8 + 10 = 18, 10 + 18 = 28, 18 + 28 = 46, 28 + 46 = 74, 46 + 74 = 120

import { MAX_POSITION_VALUE } from '../config.js';

export function generateSystem06Task() {
  // Generate two starting numbers
  const start1 = Math.floor(Math.random() * 30) + 5; // 5-34
  const start2 = Math.floor(Math.random() * 30) + 5; // 5-34
  
  // Ensure they're different and start2 > start1 for variety
  const [z1, z2] = start1 < start2 ? [start1, start2] : [start2, start1];
  
  // Build the sequence of 7 numbers
  const sequence = [z1, z2];
  let prev1 = z1;
  let prev2 = z2;
  
  for (let i = 2; i < 7; i++) {
    const next = prev1 + prev2;
    
    // Validate: ensure positive and not too large
    if (next <= 0 || next > 100000 || !Number.isInteger(next) || isNaN(next) || !isFinite(next)) {
      // Retry with new starting numbers
      return generateSystem06Task();
    }
    
    sequence.push(next);
    prev1 = prev2;
    prev2 = next;
  }
  
  // Calculate correct answers for positions 8 and 9
  // Position 8: sum of positions 6 and 7
  const pos8 = sequence[5] + sequence[6];
  
  // Position 9: sum of positions 7 and 8
  const pos9 = sequence[6] + pos8;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > MAX_POSITION_VALUE || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > MAX_POSITION_VALUE || isNaN(pos9) || !isFinite(pos9)) {
    // Retry if invalid
    return generateSystem06Task();
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence);
  
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence) {
  const wrongPairs = new Set();
  
  // Generate 4 wrong answer pairs
  while (wrongPairs.size < 4) {
    const variation = Math.floor(Math.random() * 6);
    let wrongPos8, wrongPos9;
    
    switch (variation) {
      case 0:
        // Both positions slightly off
        wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 5);
        wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 40) + 10);
        break;
      case 1:
        // First position correct, second wrong
        wrongPos8 = correctPos8;
        wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 30) + 10);
        break;
      case 2:
        // First position wrong, second follows Fibonacci pattern from wrong first
        wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 5);
        wrongPos9 = sequence[6] + wrongPos8; // Fibonacci: pos7 + pos8
        break;
      case 3:
        // Use wrong Fibonacci calculation (e.g., pos6 + pos7 with wrong values)
        wrongPos8 = sequence[4] + sequence[6]; // Wrong: pos5 + pos7 instead of pos6 + pos7
        wrongPos9 = sequence[6] + wrongPos8;
        break;
      case 4:
        // Use wrong Fibonacci calculation for position 9
        wrongPos8 = sequence[5] + sequence[6];
        wrongPos9 = sequence[5] + wrongPos8; // Wrong: pos6 + pos8 instead of pos7 + pos8
        break;
      case 5:
        // Use sequence values with variations
        const seqValue1 = sequence[Math.floor(Math.random() * sequence.length)];
        const seqValue2 = sequence[Math.floor(Math.random() * sequence.length)];
        wrongPos8 = seqValue1 + seqValue2;
        wrongPos9 = wrongPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 25) + 10);
        break;
    }
    
    // Ensure positive integer values, not the correct pair, and not too similar
    wrongPos8 = Math.max(1, Math.round(wrongPos8));
    wrongPos9 = Math.max(1, Math.round(wrongPos9));
    
    const isTooSimilar = Math.abs(wrongPos8 - correctPos8) < 5 && Math.abs(wrongPos9 - correctPos9) < 10;
    
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
