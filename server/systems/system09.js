// System 09: Fibonacci variant
// Each number is the sum of the number 3 positions before and the number 1 position before
// Z(n) = Z(n-1) + Z(n-3)
// Example: 7, 8, 10, 17, 25, 35, 52
// Z4 = Z3 + Z1 = 10 + 7 = 17
// Z5 = Z4 + Z2 = 17 + 8 = 25
// Z6 = Z5 + Z3 = 25 + 10 = 35
// Z7 = Z6 + Z4 = 35 + 17 = 52

export function generateSystem09Task() {
  // Generate three starting numbers (Z1, Z2, Z3)
  const z1 = Math.floor(Math.random() * 20) + 5; // 5-24
  const z2 = Math.floor(Math.random() * 20) + 5; // 5-24
  const z3 = Math.floor(Math.random() * 20) + 5; // 5-24
  
  // Build the sequence of 7 numbers
  const sequence = [z1, z2, z3];
  
  // Calculate Z4, Z5, Z6, Z7
  for (let i = 3; i < 7; i++) {
    // Z(n) = Z(n-1) + Z(n-3)
    const next = sequence[i - 1] + sequence[i - 3];
    
    // Validate: ensure positive and not too large
    if (next <= 0 || next > 100000 || !Number.isInteger(next) || isNaN(next) || !isFinite(next)) {
      // Retry with new starting numbers
      return generateSystem09Task();
    }
    
    sequence.push(next);
  }
  
  // Calculate correct answers for positions 8 and 9
  // Position 8: Z8 = Z7 + Z5
  const pos8 = sequence[6] + sequence[4];
  
  // Position 9: Z9 = Z8 + Z6
  const pos9 = pos8 + sequence[5];
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    // Retry if invalid
    return generateSystem09Task();
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
        // First position wrong, second follows pattern from wrong first
        wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 5);
        wrongPos9 = wrongPos8 + sequence[5]; // Z9 = Z8 + Z6
        break;
      case 3:
        // Use wrong calculation for position 8 (e.g., Z7 + Z6 instead of Z7 + Z5)
        wrongPos8 = sequence[6] + sequence[5]; // Wrong: pos7 + pos6 instead of pos7 + pos5
        wrongPos9 = wrongPos8 + sequence[5];
        break;
      case 4:
        // Use wrong calculation for position 9 (e.g., Z8 + Z5 instead of Z8 + Z6)
        wrongPos8 = sequence[6] + sequence[4];
        wrongPos9 = wrongPos8 + sequence[4]; // Wrong: pos8 + pos5 instead of pos8 + pos6
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
