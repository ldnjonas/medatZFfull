// System 19: 1er-Sprung - Alternating Fibonacci and digit sum (Ziffernquersumme)
// Pattern alternates between:
// 1. Digit sum: Z(n) + Quersumme(Z(n)) = Z(n+1)
// 2. Fibonacci: Z(n) + Z(n+1) = Z(n+2)
// Example: 22, 26, 48, 60, 108, 117, 225
// 22 → 26: 22 + (2+2) = 22 + 4 = 26 (digit sum)
// 22 + 26 = 48 (Fibonacci)
// 48 → 60: 48 + (4+8) = 48 + 12 = 60 (digit sum)
// 48 + 60 = 108 (Fibonacci)
// 108 → 117: 108 + (1+0+8) = 108 + 9 = 117 (digit sum)
// 108 + 117 = 225 (Fibonacci)

export function generateSystem19Task() {
  // Randomly choose between standard and reverse pattern FIRST
  const useStandard = Math.random() > 0.5;
  
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      if (useStandard) {
        // Standard: Start with digit sum, then Fibonacci
        const result = generateStandardPattern();
        if (result && result.sequence && result.sequence.length === 7) {
          return result;
        }
      } else {
        // Reverse: Start with Fibonacci, then digit sum
        const result = generateReversePattern();
        if (result && result.sequence && result.sequence.length === 7) {
          return result;
        }
      }
    } catch (error) {
      // Continue to next attempt
    }
    attempts++;
  }
  
  // If the chosen pattern failed, try the other one
  try {
    if (useStandard) {
      const result = generateReversePattern();
      if (result && result.sequence && result.sequence.length === 7) {
        return result;
      }
    } else {
      const result = generateStandardPattern();
      if (result && result.sequence && result.sequence.length === 7) {
        return result;
      }
    }
  } catch (error) {
    // Fall through to safe pattern
  }
  
  // Final fallback to safe pattern
  return generateSystem19Safe();
}

// Standard pattern: Start with digit sum, then Fibonacci
// Position 1 → 2: digit sum
// Position 1 + 2 → 3: Fibonacci
// Position 3 → 4: digit sum
// Position 3 + 4 → 5: Fibonacci
// Position 5 → 6: digit sum
// Position 5 + 6 → 7: Fibonacci
function generateStandardPattern() {
  // Generate starting number
  const start = Math.floor(Math.random() * 50) + 10; // 10-59
  
  // Build sequence
  const sequence = [start];
  
  // Position 2: Position 1 + digit sum
  const digitSum1 = calculateDigitSum(sequence[0]);
  const pos2 = sequence[0] + digitSum1;
  if (!Number.isInteger(pos2) || pos2 <= 0 || pos2 > 100000 || isNaN(pos2) || !isFinite(pos2)) {
    throw new Error('Invalid position 2');
  }
  sequence.push(pos2);
  
  // Position 3: Position 1 + Position 2 (Fibonacci)
  const pos3 = sequence[0] + sequence[1];
  if (!Number.isInteger(pos3) || pos3 <= 0 || pos3 > 100000 || isNaN(pos3) || !isFinite(pos3)) {
    throw new Error('Invalid position 3');
  }
  sequence.push(pos3);
  
  // Position 4: Position 3 + digit sum
  const digitSum3 = calculateDigitSum(sequence[2]);
  const pos4 = sequence[2] + digitSum3;
  if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
    throw new Error('Invalid position 4');
  }
  sequence.push(pos4);
  
  // Position 5: Position 3 + Position 4 (Fibonacci)
  const pos5 = sequence[2] + sequence[3];
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: Position 5 + digit sum
  const digitSum5 = calculateDigitSum(sequence[4]);
  const pos6 = sequence[4] + digitSum5;
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Position 7: Position 5 + Position 6 (Fibonacci)
  const pos7 = sequence[4] + sequence[5];
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // Position 8: Position 7 + digit sum
  const digitSum7 = calculateDigitSum(sequence[6]);
  const pos8 = sequence[6] + digitSum7;
  
  // Position 9: Position 7 + Position 8 (Fibonacci)
  const pos9 = sequence[6] + pos8;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    throw new Error('Invalid answer values');
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, 'standard');
  
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

// Reverse pattern: Start with Fibonacci, then digit sum
// Position 1 + Position 2 → 3: Fibonacci
// Position 3 → 4: digit sum
// Position 3 + Position 4 → 5: Fibonacci
// Position 5 → 6: digit sum
// Position 5 + Position 6 → 7: Fibonacci
function generateReversePattern() {
  // Generate starting numbers for positions 1 and 2
  const start1 = Math.floor(Math.random() * 30) + 5; // 5-34
  const start2 = Math.floor(Math.random() * 30) + 5; // 5-34
  
  // Build sequence
  const sequence = [start1, start2];
  
  // Position 3: Position 1 + Position 2 (Fibonacci)
  const pos3 = sequence[0] + sequence[1];
  if (!Number.isInteger(pos3) || pos3 <= 0 || pos3 > 100000 || isNaN(pos3) || !isFinite(pos3)) {
    throw new Error('Invalid position 3');
  }
  sequence.push(pos3);
  
  // Position 4: Position 3 + digit sum
  const digitSum3 = calculateDigitSum(sequence[2]);
  const pos4 = sequence[2] + digitSum3;
  if (!Number.isInteger(pos4) || pos4 <= 0 || pos4 > 100000 || isNaN(pos4) || !isFinite(pos4)) {
    throw new Error('Invalid position 4');
  }
  sequence.push(pos4);
  
  // Position 5: Position 3 + Position 4 (Fibonacci)
  const pos5 = sequence[2] + sequence[3];
  if (!Number.isInteger(pos5) || pos5 <= 0 || pos5 > 100000 || isNaN(pos5) || !isFinite(pos5)) {
    throw new Error('Invalid position 5');
  }
  sequence.push(pos5);
  
  // Position 6: Position 5 + digit sum
  const digitSum5 = calculateDigitSum(sequence[4]);
  const pos6 = sequence[4] + digitSum5;
  if (!Number.isInteger(pos6) || pos6 <= 0 || pos6 > 100000 || isNaN(pos6) || !isFinite(pos6)) {
    throw new Error('Invalid position 6');
  }
  sequence.push(pos6);
  
  // Position 7: Position 5 + Position 6 (Fibonacci)
  const pos7 = sequence[4] + sequence[5];
  if (!Number.isInteger(pos7) || pos7 <= 0 || pos7 > 100000 || isNaN(pos7) || !isFinite(pos7)) {
    throw new Error('Invalid position 7');
  }
  sequence.push(pos7);
  
  // Calculate positions 8 and 9
  // Position 8: Position 7 + digit sum
  const digitSum7 = calculateDigitSum(sequence[6]);
  const pos8 = sequence[6] + digitSum7;
  
  // Position 9: Position 7 + Position 8 (Fibonacci)
  const pos9 = sequence[6] + pos8;
  
  // Final validation
  if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
      !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
    throw new Error('Invalid answer values');
  }
  
  // Generate wrong answer pairs
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, 'reverse');
  
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

function calculateDigitSum(number) {
  let sum = 0;
  let n = Math.abs(number);
  while (n > 0) {
    sum += n % 10;
    n = Math.floor(n / 10);
  }
  return sum;
}

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, patternType) {
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
            const digitSum7 = calculateDigitSum(sequence[6]);
            wrongPos8 = sequence[5] + sequence[6]; // Fibonacci instead of digit sum
            wrongPos9 = sequence[6] + wrongPos8;
          } else {
            // Use standard pattern
            const digitSum7 = calculateDigitSum(sequence[6]);
            wrongPos8 = sequence[6] + digitSum7; // Digit sum instead of Fibonacci
            wrongPos9 = sequence[6] + wrongPos8;
          }
          break;
        case 3:
          // Use wrong digit sum (e.g., only first digit)
          const firstDigit = Math.floor(sequence[6] / Math.pow(10, Math.floor(Math.log10(sequence[6]))));
          if (patternType === 'standard') {
            wrongPos8 = sequence[6] + firstDigit;
            wrongPos9 = sequence[6] + wrongPos8;
          } else {
            wrongPos8 = sequence[6] + firstDigit;
            wrongPos9 = sequence[6] + wrongPos8;
          }
          break;
        case 4:
          // Use wrong source positions
          if (patternType === 'standard') {
            const digitSum5 = calculateDigitSum(sequence[4]);
            wrongPos8 = sequence[4] + digitSum5;
            wrongPos9 = sequence[4] + wrongPos8;
          } else {
            wrongPos8 = sequence[4] + sequence[5];
            wrongPos9 = sequence[4] + wrongPos8;
          }
          break;
        case 5:
          // Use subtraction instead of addition
          if (patternType === 'standard') {
            const digitSum7 = calculateDigitSum(sequence[6]);
            wrongPos8 = Math.abs(sequence[6] - digitSum7);
            wrongPos9 = Math.abs(sequence[6] - wrongPos8);
          } else {
            wrongPos8 = Math.abs(sequence[5] - sequence[6]);
            wrongPos9 = Math.abs(sequence[6] - wrongPos8);
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

function generateSystem19Safe() {
  // Safe fallback: use standard pattern with example values
  const start = 22;
  const sequence = [start];
  
  // Position 2: digit sum
  const digitSum1 = calculateDigitSum(sequence[0]);
  sequence.push(sequence[0] + digitSum1); // 26
  
  // Position 3: Fibonacci
  sequence.push(sequence[0] + sequence[1]); // 48
  
  // Position 4: digit sum
  const digitSum3 = calculateDigitSum(sequence[2]);
  sequence.push(sequence[2] + digitSum3); // 60
  
  // Position 5: Fibonacci
  sequence.push(sequence[2] + sequence[3]); // 108
  
  // Position 6: digit sum
  const digitSum5 = calculateDigitSum(sequence[4]);
  sequence.push(sequence[4] + digitSum5); // 117
  
  // Position 7: Fibonacci
  sequence.push(sequence[4] + sequence[5]); // 225
  
  const digitSum7 = calculateDigitSum(sequence[6]);
  const pos8 = sequence[6] + digitSum7;
  const pos9 = sequence[6] + pos8;
  
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, 'standard');
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
