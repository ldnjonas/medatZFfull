// System 07: Fibonacci with alternating addition and subtraction
// Z3 = Z1 + Z2, Z4 = Z3 - Z2, Z5 = Z4 + Z3, Z6 = Z5 - Z4, ...
// Pattern: +, -, +, -, +, -, ...
// Example: 34, 19, 53, 34, 87, 53, 140
// 34 + 19 = 53, 53 - 19 = 34, 34 + 53 = 87, 87 - 34 = 53, 53 + 87 = 140

export function generateSystem07Task() {
  // Generate two starting numbers
  const start1 = Math.floor(Math.random() * 40) + 10; // 10-49
  const start2 = Math.floor(Math.random() * 40) + 10; // 10-49
  
  // Ensure they're different
  const [z1, z2] = start1 !== start2 ? [start1, start2] : [start1, start2 + 1];
  
  // Build the sequence of 7 numbers
  const sequence = [z1, z2];
  let prev1 = z1;
  let prev2 = z2;
  
  for (let i = 2; i < 7; i++) {
    let next;
    
    if (i % 2 === 0) {
      // Even index (i=2,4,6): Addition
      next = prev1 + prev2;
    } else {
      // Odd index (i=3,5): Subtraction
      next = prev2 - prev1;
    }
    
    // Validate: ensure positive and not too large
    if (next <= 0 || next > 100000 || !Number.isInteger(next) || isNaN(next) || !isFinite(next)) {
      // Retry with new starting numbers
      return generateSystem07Task();
    }
    
    sequence.push(next);
    prev1 = prev2;
    prev2 = next;
  }
  
  // Calculate correct answers for positions 8 and 9
  // Position 8: after position 7 (index 6, even), so subtraction: Z7 - Z6
  const pos8 = sequence[6] - sequence[5];
  
  // Position 9: after position 8 (index 7, odd), so addition: Z8 + Z7
  const pos9 = pos8 + sequence[6];
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    // Retry if invalid
    return generateSystem07Task();
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
        wrongPos9 = wrongPos8 + sequence[6]; // Addition: pos8 + pos7
        break;
      case 3:
        // Use wrong operation for position 8 (e.g., addition instead of subtraction)
        wrongPos8 = sequence[6] + sequence[5]; // Wrong: pos7 + pos6 instead of pos7 - pos6
        wrongPos9 = wrongPos8 + sequence[6];
        break;
      case 4:
        // Use wrong operation for position 9 (e.g., subtraction instead of addition)
        wrongPos8 = sequence[6] - sequence[5];
        wrongPos9 = wrongPos8 - sequence[6]; // Wrong: pos8 - pos7 instead of pos8 + pos7
        break;
      case 5:
        // Use sequence values with variations
        const seqValue1 = sequence[Math.floor(Math.random() * sequence.length)];
        const seqValue2 = sequence[Math.floor(Math.random() * sequence.length)];
        wrongPos8 = Math.abs(seqValue1 - seqValue2); // Use difference
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
