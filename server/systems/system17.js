// System 17: 1er-Sprung - Digit sum (Quersumme) of the last number added/subtracted
// Z(n+1) = Z(n) + Quersumme(Z(n)) or Z(n+1) = Z(n) - Quersumme(Z(n))
// Example: 44, 52, 59, 73, 83, 94, 107
// 44 → 52: 44 + (4+4) = 44 + 8 = 52
// 52 → 59: 52 + (5+2) = 52 + 7 = 59
// 59 → 73: 59 + (5+9) = 59 + 14 = 73

export function generateSystem17Task() {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      // Randomly choose between addition and subtraction
      const useAddition = Math.random() > 0.5;
      
      // Generate starting number
      const start = Math.floor(Math.random() * 50) + 10; // 10-59
      
      // Build sequence
      const sequence = [start];
      
      for (let i = 0; i < 6; i++) {
        const digitSum = calculateDigitSum(sequence[i]);
        let next;
        
        if (useAddition) {
          next = sequence[i] + digitSum;
        } else {
          next = sequence[i] - digitSum;
          // Ensure positive
          if (next <= 0) {
            throw new Error('Negative result');
          }
        }
        
        // Validate
        if (!Number.isInteger(next) || next <= 0 || next > 100000 || isNaN(next) || !isFinite(next)) {
          throw new Error('Invalid sequence value');
        }
        
        sequence.push(next);
      }
      
      // Validate sequence
      if (sequence.length !== 7) {
        throw new Error('Invalid sequence length');
      }
      
      // Calculate positions 8 and 9
      const digitSum7 = calculateDigitSum(sequence[6]);
      let pos8;
      if (useAddition) {
        pos8 = sequence[6] + digitSum7;
      } else {
        pos8 = sequence[6] - digitSum7;
        if (pos8 <= 0) {
          throw new Error('Negative position 8');
        }
      }
      
      const digitSum8 = calculateDigitSum(pos8);
      let pos9;
      if (useAddition) {
        pos9 = pos8 + digitSum8;
      } else {
        pos9 = pos8 - digitSum8;
        if (pos9 <= 0) {
          throw new Error('Negative position 9');
        }
      }
      
      // Final validation
      if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
          !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
        throw new Error('Invalid answer values');
      }
      
      // Generate wrong answer pairs
      const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, useAddition);
      
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
    } catch (error) {
      attempts++;
      if (attempts >= maxAttempts) {
        // Fallback to safe pattern
        return generateSystem17Safe();
      }
    }
  }
  
  return generateSystem17Safe();
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

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, useAddition) {
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
          // Use wrong operation (addition instead of subtraction or vice versa)
          const digitSum7 = calculateDigitSum(sequence[6]);
          if (useAddition) {
            wrongPos8 = sequence[6] - digitSum7;
          } else {
            wrongPos8 = sequence[6] + digitSum7;
          }
          if (wrongPos8 <= 0) {
            wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          }
          const digitSum8Wrong = calculateDigitSum(wrongPos8);
          if (useAddition) {
            wrongPos9 = wrongPos8 - digitSum8Wrong;
          } else {
            wrongPos9 = wrongPos8 + digitSum8Wrong;
          }
          if (wrongPos9 <= 0) {
            wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          }
          break;
        case 3:
          // Use wrong digit sum calculation (e.g., only first digit)
          const firstDigit = Math.floor(sequence[6] / Math.pow(10, Math.floor(Math.log10(sequence[6]))));
          wrongPos8 = sequence[6] + (useAddition ? firstDigit : -firstDigit);
          if (wrongPos8 <= 0) {
            wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          }
          const firstDigit8 = Math.floor(wrongPos8 / Math.pow(10, Math.floor(Math.log10(wrongPos8))));
          wrongPos9 = wrongPos8 + (useAddition ? firstDigit8 : -firstDigit8);
          if (wrongPos9 <= 0) {
            wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          }
          break;
        case 4:
          // Use wrong source position
          if (sequence.length > 5) {
            const digitSum5 = calculateDigitSum(sequence[5]);
            wrongPos8 = sequence[5] + (useAddition ? digitSum5 : -digitSum5);
            if (wrongPos8 <= 0) {
              wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
            }
          } else {
            wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          }
          const digitSum8Wrong2 = calculateDigitSum(wrongPos8);
          wrongPos9 = wrongPos8 + (useAddition ? digitSum8Wrong2 : -digitSum8Wrong2);
          if (wrongPos9 <= 0) {
            wrongPos9 = correctPos9 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 4);
          }
          break;
        case 5:
          // Use product of digits instead of sum
          const product7 = getDigitProduct(sequence[6]);
          wrongPos8 = sequence[6] + (useAddition ? product7 : -product7);
          if (wrongPos8 <= 0 || product7 === 0) {
            wrongPos8 = correctPos8 + (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
          }
          const product8 = getDigitProduct(wrongPos8);
          wrongPos9 = wrongPos8 + (useAddition ? product8 : -product8);
          if (wrongPos9 <= 0 || product8 === 0) {
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

function getDigitProduct(number) {
  let product = 1;
  let n = Math.abs(number);
  let hasDigits = false;
  while (n > 0) {
    const digit = n % 10;
    if (digit > 0) {
      product *= digit;
      hasDigits = true;
    }
    n = Math.floor(n / 10);
  }
  return hasDigits ? product : 1;
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

function generateSystem17Safe() {
  // Safe fallback: use addition with example values
  const start = 44;
  const sequence = [start];
  
  for (let i = 0; i < 6; i++) {
    const digitSum = calculateDigitSum(sequence[i]);
    sequence.push(sequence[i] + digitSum);
  }
  
  const digitSum7 = calculateDigitSum(sequence[6]);
  const pos8 = sequence[6] + digitSum7;
  
  const digitSum8 = calculateDigitSum(pos8);
  const pos9 = pos8 + digitSum8;
  
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, true);
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
