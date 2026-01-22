// System 08: Tribonacci sequence
// Each number is the sum of the three preceding numbers
// Z(n) = Z(n-1) + Z(n-2) + Z(n-3)
// Example: 5, 11, 12, 28, 51, 91, 170
// 5 + 11 + 12 = 28, 11 + 12 + 28 = 51, 12 + 28 + 51 = 91, 28 + 51 + 91 = 170

export function generateSystem08Task() {
  // Generate three starting numbers
  const start1 = Math.floor(Math.random() * 15) + 3; // 3-17
  const start2 = Math.floor(Math.random() * 15) + 3; // 3-17
  const start3 = Math.floor(Math.random() * 15) + 3; // 3-17
  
  // Ensure they're all different
  const [z1, z2, z3] = [start1, start2, start3].sort((a, b) => a - b);
  
  // Build the sequence of 7 numbers
  const sequence = [z1, z2, z3];
  let prev1 = z1;
  let prev2 = z2;
  let prev3 = z3;
  
  for (let i = 3; i < 7; i++) {
    const next = prev1 + prev2 + prev3;
    
    // Validate: ensure positive and not too large
    if (next <= 0 || next > 100000 || !Number.isInteger(next) || isNaN(next) || !isFinite(next)) {
      // Retry with new starting numbers
      return generateSystem08Task();
    }
    
    sequence.push(next);
    prev1 = prev2;
    prev2 = prev3;
    prev3 = next;
  }
  
  // Calculate correct answers for positions 8 and 9
  // Position 8: sum of positions 5, 6, and 7
  const pos8 = sequence[4] + sequence[5] + sequence[6];
  
  // Position 9: sum of positions 6, 7, and 8
  const pos9 = sequence[5] + sequence[6] + pos8;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    // Retry if invalid
    return generateSystem08Task();
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
        wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 30) + 10);
        wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 50) + 20);
        break;
      case 1:
        // First position correct, second wrong
        wrongPos8 = correctPos8;
        wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 40) + 15);
        break;
      case 2:
        // First position wrong, second follows Tribonacci pattern from wrong first
        wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 30) + 10);
        wrongPos9 = sequence[5] + sequence[6] + wrongPos8; // Tribonacci: pos6 + pos7 + pos8
        break;
      case 3:
        // Use wrong Tribonacci calculation (e.g., wrong combination of previous numbers)
        wrongPos8 = sequence[3] + sequence[5] + sequence[6]; // Wrong: pos4 + pos6 + pos7 instead of pos5 + pos6 + pos7
        wrongPos9 = sequence[5] + sequence[6] + wrongPos8;
        break;
      case 4:
        // Use wrong Tribonacci calculation for position 9
        wrongPos8 = sequence[4] + sequence[5] + sequence[6];
        wrongPos9 = sequence[4] + sequence[6] + wrongPos8; // Wrong: pos5 + pos7 + pos8 instead of pos6 + pos7 + pos8
        break;
      case 5:
        // Use sequence values with variations
        const seqValue1 = sequence[Math.floor(Math.random() * sequence.length)];
        const seqValue2 = sequence[Math.floor(Math.random() * sequence.length)];
        const seqValue3 = sequence[Math.floor(Math.random() * sequence.length)];
        wrongPos8 = seqValue1 + seqValue2 + seqValue3;
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
