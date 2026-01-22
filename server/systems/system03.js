// System 03: Two layers of differences
// First layer: differences between consecutive numbers in main sequence
// Second layer: differences between consecutive first-layer differences (geometric progression *2)
// Formula for first layer: D1_k = R + (2^k - 1) * x
// Where R is the initial first-layer difference, x is the initial second-layer difference
// Example: 16, 28, 42, 60, 86, 128, 202
// First layer: +12, +14, +18, +26, +42, +74
// Second layer: +2, +4, +8, +16, +32 (each *2)

export function generateSystem03Task() {
  // Use a simpler approach: generate with known safe parameter ranges
  // Try up to 100 times to find valid parameters
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      // Generate parameters with conservative ranges
      const startNumber = Math.floor(Math.random() * 31) + 15; // 15-45
      const r = Math.floor(Math.random() * 6) + 5; // 5-10
      const x = Math.floor(Math.random() * 2) + 1; // 1-2
      
      // Build the sequence
      const sequence = [startNumber];
      let current = startNumber;
      let valid = true;
      
      // Build sequence of 7 numbers
      for (let i = 0; i < 6; i++) {
        const k = i;
        const d1_k = r + (Math.pow(2, k) - 1) * x;
        
        // Validate difference
        if (!Number.isInteger(d1_k) || d1_k <= 0 || d1_k > 5000 || isNaN(d1_k) || !isFinite(d1_k)) {
          valid = false;
          break;
        }
        
        current = current + d1_k;
        
        // Validate current number
        if (!Number.isInteger(current) || current <= 0 || current > 50000 || isNaN(current) || !isFinite(current)) {
          valid = false;
          break;
        }
        
        sequence.push(current);
      }
      
      // If sequence is invalid, try again
      if (!valid || sequence.length !== 7) {
        continue;
      }
      
      // Calculate position 8
      const k6 = 6;
      const d1_6 = r + (Math.pow(2, k6) - 1) * x;
      
      if (!Number.isInteger(d1_6) || d1_6 <= 0 || d1_6 > 5000 || isNaN(d1_6) || !isFinite(d1_6)) {
        continue;
      }
      
      const pos8 = current + d1_6;
      
      if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 50000 || isNaN(pos8) || !isFinite(pos8)) {
        continue;
      }
      
      // Calculate position 9
      const k7 = 7;
      const d1_7 = r + (Math.pow(2, k7) - 1) * x;
      
      if (!Number.isInteger(d1_7) || d1_7 <= 0 || d1_7 > 5000 || isNaN(d1_7) || !isFinite(d1_7)) {
        continue;
      }
      
      const pos9 = pos8 + d1_7;
      
      if (!Number.isInteger(pos9) || pos9 <= 0 || pos9 > 50000 || isNaN(pos9) || !isFinite(pos9)) {
        continue;
      }
      
      // All validations passed, generate wrong answers and return
      const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, r, x);
      
      if (!wrongAnswerPairs || wrongAnswerPairs.length < 4) {
        continue;
      }
      
      const options = createAnswerOptionsPair(pos8, pos9, wrongAnswerPairs);
      
      if (!options || options.length !== 5) {
        continue;
      }
      
      // Final validation of return object
      const result = {
        sequence: sequence,
        correctAnswer: {
          position8: pos8,
          position9: pos9
        },
        options: options
      };
      
      // Double-check all values are valid
      const allSequenceValid = result.sequence.every(n => 
        Number.isInteger(n) && n > 0 && n <= 50000 && isFinite(n)
      );
      
      if (allSequenceValid && 
          Number.isInteger(result.correctAnswer.position8) && 
          result.correctAnswer.position8 > 0 &&
          Number.isInteger(result.correctAnswer.position9) && 
          result.correctAnswer.position9 > 0) {
        return result;
      }
    } catch (error) {
      // If any error occurs, try again
      continue;
    }
  }
  
  // If we couldn't generate after 100 attempts, use guaranteed safe parameters
  return generateWithSafeParams();
}

function generateWithSafeParams() {
  // Use known safe parameters that always work
  const startNumber = 20;
  const r = 5;
  const x = 1;
  
  // Build the sequence
  const sequence = [startNumber];
  let current = startNumber;
  
  for (let i = 0; i < 6; i++) {
    const k = i;
    const d1_k = r + (Math.pow(2, k) - 1) * x;
    current = current + d1_k;
    sequence.push(current);
  }
  
  // Calculate position 8
  const k6 = 6;
  const d1_6 = r + (Math.pow(2, k6) - 1) * x;
  const pos8 = current + d1_6;
  
  // Calculate position 9
  const k7 = 7;
  const d1_7 = r + (Math.pow(2, k7) - 1) * x;
  const pos9 = pos8 + d1_7;
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, r, x);
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, r, x) {
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
        // Apply D1_7 to wrong pos8
        const k7 = 7;
        const d1_7 = r + (Math.pow(2, k7) - 1) * x;
        wrongPos9 = wrongPos8 + d1_7;
        break;
      case 3:
        // Use wrong k value for position 8 (e.g., k=5 instead of k=6)
        const k5 = 5;
        const d1_5 = r + (Math.pow(2, k5) - 1) * x;
        wrongPos8 = sequence[6] + d1_5;
        const d1_7Wrong = r + (Math.pow(2, k7) - 1) * x;
        wrongPos9 = wrongPos8 + d1_7Wrong;
        break;
      case 4:
        // Use wrong k value for position 9 (e.g., k=6 instead of k=7)
        const k6 = 6;
        const d1_6Correct = r + (Math.pow(2, k6) - 1) * x;
        wrongPos8 = sequence[6] + d1_6Correct;
        const k6Wrong = 6;
        const d1_6Wrong = r + (Math.pow(2, k6Wrong) - 1) * x;
        wrongPos9 = wrongPos8 + d1_6Wrong;
        break;
      case 5:
        // Use sequence values with variations
        const seqValue = sequence[Math.floor(Math.random() * sequence.length)];
        wrongPos8 = seqValue + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 15) + 5);
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
