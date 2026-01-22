// System 10: Fibonacci in calculation step
// The differences between consecutive numbers form a Fibonacci sequence
// Example: 9, 11, 18, 27, 43, 68, 109
// Differences: +2, +7, +9, +16, +25, +41
// The differences follow Fibonacci: 2, 7, 9, 16, 25, 41
// 2 + 7 = 9, 7 + 9 = 16, 9 + 16 = 25, 16 + 25 = 41

import { MAX_POSITION_VALUE } from '../config.js';

export function generateSystem10Task() {
  // Generate starting number and first two differences
  const startNumber = Math.floor(Math.random() * 30) + 5; // 5-34
  const diff1 = Math.floor(Math.random() * 15) + 2; // 2-16 (first difference)
  const diff2 = Math.floor(Math.random() * 15) + 2; // 2-16 (second difference)
  
  // Ensure differences are different
  const [d1, d2] = diff1 !== diff2 ? [diff1, diff2] : [diff1, diff2 + 1];
  
  // Build the sequence of 7 numbers
  const sequence = [startNumber];
  const differences = [d1, d2]; // Store differences for later use
  let current = startNumber;
  
  // Calculate first two numbers after start
  current = current + d1;
  sequence.push(current);
  
  current = current + d2;
  sequence.push(current);
  
  // Now calculate remaining numbers using Fibonacci pattern for differences
  for (let i = 2; i < 6; i++) {
    // Next difference is sum of previous two differences (Fibonacci)
    const nextDiff = differences[i - 2] + differences[i - 1];
    
    // Validate difference
    if (nextDiff <= 0 || nextDiff > 10000 || !Number.isInteger(nextDiff) || isNaN(nextDiff) || !isFinite(nextDiff)) {
      return generateSystem10Task();
    }
    
    differences.push(nextDiff);
    current = current + nextDiff;
    
    // Validate current number
    if (current <= 0 || current > 100000 || !Number.isInteger(current) || isNaN(current) || !isFinite(current)) {
      return generateSystem10Task();
    }
    
    sequence.push(current);
  }
  
  // Calculate correct answers for positions 8 and 9
  // Position 8: next difference is D6 + D7 (Fibonacci)
  const diff7 = differences[4] + differences[5]; // D6 + D7
  const pos8 = current + diff7;
  
  // Position 9: next difference is D7 + D8 (Fibonacci)
  const diff8 = differences[5] + diff7; // D7 + D8
  const pos9 = pos8 + diff8;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > MAX_POSITION_VALUE || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > MAX_POSITION_VALUE || isNaN(pos9) || !isFinite(pos9)) {
    // Retry if invalid
    return generateSystem10Task();
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, differences);
  
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, differences) {
  const wrongPairs = new Set();
  
  // Generate 4 wrong answer pairs
  while (wrongPairs.size < 4) {
    const variation = Math.floor(Math.random() * 6);
    let wrongPos8, wrongPos9;
    
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
        const diff8Wrong = differences[5] + (differences[4] + differences[5]);
        wrongPos9 = wrongPos8 + diff8Wrong;
        break;
      case 3:
        // Use wrong difference calculation for position 8
        const diff7Wrong = differences[3] + differences[5]; // Wrong: D5 + D7 instead of D6 + D7
        wrongPos8 = sequence[6] + diff7Wrong;
        const diff8Wrong2 = differences[5] + diff7Wrong;
        wrongPos9 = wrongPos8 + diff8Wrong2;
        break;
      case 4:
        // Use wrong difference calculation for position 9
        const diff7Correct = differences[4] + differences[5];
        wrongPos8 = sequence[6] + diff7Correct;
        const diff8Wrong3 = differences[4] + diff7Correct; // Wrong: D6 + D8 instead of D7 + D8
        wrongPos9 = wrongPos8 + diff8Wrong3;
        break;
      case 5:
        // Use sequence values with variations
        const seqValue = sequence[Math.floor(Math.random() * sequence.length)];
        wrongPos8 = seqValue + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 25) + 10);
        wrongPos9 = wrongPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 30) + 15);
        break;
    }
    
    // Ensure positive integer values, not the correct pair, and not too similar
    wrongPos8 = Math.max(1, Math.round(wrongPos8));
    wrongPos9 = Math.max(1, Math.round(wrongPos9));
    
    const isTooSimilar = Math.abs(wrongPos8 - correctPos8) < 10 && Math.abs(wrongPos9 - correctPos9) < 20;
    
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
