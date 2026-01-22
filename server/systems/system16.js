// System 16: 1er-Sprung - 3 Ebenen (4 levels of differences)
// The 4th level of differences is constant
// Example: 9, 16, 24, 35, 54, 89, 151
// 1st differences: +7, +8, +11, +19, +35, +62
// 2nd differences: +1, +3, +8, +16, +27
// 3rd differences: +2, +5, +8, +11
// 4th differences: +3, +3, +3 (constant!)

export function generateSystem16Task() {
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    try {
      // Generate constant value for 4th level differences
      const constantDiff = Math.floor(Math.random() * 5) + 1; // 1-5
      
      // Generate starting values for the 3rd level differences
      // We need 4 values for 3rd level: d3[0], d3[1], d3[2], d3[3]
      // The 4th level differences are constant, so:
      // d3[1] = d3[0] + constantDiff
      // d3[2] = d3[1] + constantDiff = d3[0] + 2*constantDiff
      // d3[3] = d3[2] + constantDiff = d3[0] + 3*constantDiff
      const d3Start = Math.floor(Math.random() * 5) + 1; // 1-5
      const d3 = [
        d3Start,
        d3Start + constantDiff,
        d3Start + 2 * constantDiff,
        d3Start + 3 * constantDiff
      ];
      
      // Generate starting values for the 2nd level differences
      // We need 5 values for 2nd level: d2[0], d2[1], d2[2], d2[3], d2[4]
      // d2[1] = d2[0] + d3[0]
      // d2[2] = d2[1] + d3[1] = d2[0] + d3[0] + d3[1]
      // d2[3] = d2[2] + d3[2] = d2[0] + d3[0] + d3[1] + d3[2]
      // d2[4] = d2[3] + d3[3] = d2[0] + d3[0] + d3[1] + d3[2] + d3[3]
      const d2Start = Math.floor(Math.random() * 5) + 1; // 1-5
      const d2 = [
        d2Start,
        d2Start + d3[0],
        d2Start + d3[0] + d3[1],
        d2Start + d3[0] + d3[1] + d3[2],
        d2Start + d3[0] + d3[1] + d3[2] + d3[3]
      ];
      
      // Generate starting values for the 1st level differences
      // We need 6 values for 1st level: d1[0], d1[1], d1[2], d1[3], d1[4], d1[5]
      // d1[1] = d1[0] + d2[0]
      // d1[2] = d1[1] + d2[1] = d1[0] + d2[0] + d2[1]
      // etc.
      const d1Start = Math.floor(Math.random() * 10) + 1; // 1-10
      const d1 = [
        d1Start,
        d1Start + d2[0],
        d1Start + d2[0] + d2[1],
        d1Start + d2[0] + d2[1] + d2[2],
        d1Start + d2[0] + d2[1] + d2[2] + d2[3],
        d1Start + d2[0] + d2[1] + d2[2] + d2[3] + d2[4]
      ];
      
      // Generate starting number for the main sequence
      const start = Math.floor(Math.random() * 20) + 5; // 5-24
      
      // Build the main sequence
      const sequence = [start];
      for (let i = 0; i < 6; i++) {
        const next = sequence[i] + d1[i];
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
      // Position 8: We need d1[6] = d1[5] + d2[5]
      // d2[5] = d2[4] + d3[4]
      // d3[4] = d3[3] + constantDiff = d3Start + 3*constantDiff + constantDiff = d3Start + 4*constantDiff
      const d3_4 = d3Start + 4 * constantDiff;
      const d2_5 = d2[4] + d3_4;
      const d1_6 = d1[5] + d2_5;
      const pos8 = sequence[6] + d1_6;
      
      // Position 9: We need d1[7] = d1[6] + d2[6]
      // d2[6] = d2[5] + d3[5]
      // d3[5] = d3[4] + constantDiff = d3Start + 4*constantDiff + constantDiff = d3Start + 5*constantDiff
      const d3_5 = d3Start + 5 * constantDiff;
      const d2_6 = d2_5 + d3_5;
      const d1_7 = d1_6 + d2_6;
      const pos9 = pos8 + d1_7;
      
      // Final validation
      if (!Number.isInteger(pos8) || pos8 <= 0 || pos8 > 100000 || isNaN(pos8) || !isFinite(pos8) ||
          !Number.isInteger(pos9) || pos9 <= 0 || pos9 > 100000 || isNaN(pos9) || !isFinite(pos9)) {
        throw new Error('Invalid answer values');
      }
      
      // Generate wrong answer pairs
      const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, d1, d2, d3, constantDiff);
      
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
        return generateSystem16Safe();
      }
    }
  }
  
  return generateSystem16Safe();
}

function generateWrongAnswerPairs(correctPos8, correctPos9, sequence, d1, d2, d3, constantDiff) {
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
          // Use wrong constant difference
          const wrongConstant = constantDiff + (Math.random() > 0.5 ? 1 : -1);
          const d3_4_wrong = d3[3] + wrongConstant;
          const d2_5_wrong = d2[4] + d3_4_wrong;
          const d1_6_wrong = d1[5] + d2_5_wrong;
          wrongPos8 = sequence[6] + d1_6_wrong;
          const d3_5_wrong = d3_4_wrong + wrongConstant;
          const d2_6_wrong = d2_5_wrong + d3_5_wrong;
          const d1_7_wrong = d1_6_wrong + d2_6_wrong;
          wrongPos9 = wrongPos8 + d1_7_wrong;
          break;
        case 3:
          // Use wrong d3 start
          const wrongD3Start = d3[0] + (Math.random() > 0.5 ? 1 : -1);
          const d3_4_wrong2 = wrongD3Start + 4 * constantDiff;
          const d2_5_wrong2 = d2[4] + d3_4_wrong2;
          const d1_6_wrong2 = d1[5] + d2_5_wrong2;
          wrongPos8 = sequence[6] + d1_6_wrong2;
          const d3_5_wrong2 = wrongD3Start + 5 * constantDiff;
          const d2_6_wrong2 = d2_5_wrong2 + d3_5_wrong2;
          const d1_7_wrong2 = d1_6_wrong2 + d2_6_wrong2;
          wrongPos9 = wrongPos8 + d1_7_wrong2;
          break;
        case 4:
          // Use wrong d2 start
          const wrongD2Start = d2[0] + (Math.random() > 0.5 ? 1 : -1);
          const d2_5_wrong3 = wrongD2Start + d3[0] + d3[1] + d3[2] + d3[3] + (d3[3] + constantDiff);
          const d1_6_wrong3 = d1[5] + d2_5_wrong3;
          wrongPos8 = sequence[6] + d1_6_wrong3;
          const d2_6_wrong3 = d2_5_wrong3 + (d3[3] + 2 * constantDiff);
          const d1_7_wrong3 = d1_6_wrong3 + d2_6_wrong3;
          wrongPos9 = wrongPos8 + d1_7_wrong3;
          break;
        case 5:
          // Use wrong d1 start
          const wrongD1Start = d1[0] + (Math.random() > 0.5 ? 1 : -1);
          const d1_6_wrong4 = wrongD1Start + d2[0] + d2[1] + d2[2] + d2[3] + d2[4] + (d2[4] + d3[3] + constantDiff);
          wrongPos8 = sequence[6] + d1_6_wrong4;
          const d1_7_wrong4 = d1_6_wrong4 + (d2[4] + d3[3] + constantDiff) + (d3[3] + 2 * constantDiff);
          wrongPos9 = wrongPos8 + d1_7_wrong4;
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

function generateSystem16Safe() {
  // Safe fallback: use example values
  const constantDiff = 3;
  const d3Start = 2;
  const d3 = [d3Start, d3Start + constantDiff, d3Start + 2 * constantDiff, d3Start + 3 * constantDiff];
  const d2Start = 1;
  const d2 = [
    d2Start,
    d2Start + d3[0],
    d2Start + d3[0] + d3[1],
    d2Start + d3[0] + d3[1] + d3[2],
    d2Start + d3[0] + d3[1] + d3[2] + d3[3]
  ];
  const d1Start = 7;
  const d1 = [
    d1Start,
    d1Start + d2[0],
    d1Start + d2[0] + d2[1],
    d1Start + d2[0] + d2[1] + d2[2],
    d1Start + d2[0] + d2[1] + d2[2] + d2[3],
    d1Start + d2[0] + d2[1] + d2[2] + d2[3] + d2[4]
  ];
  const start = 9;
  
  const sequence = [start];
  for (let i = 0; i < 6; i++) {
    sequence.push(sequence[i] + d1[i]);
  }
  
  const d3_4 = d3Start + 4 * constantDiff;
  const d2_5 = d2[4] + d3_4;
  const d1_6 = d1[5] + d2_5;
  const pos8 = sequence[6] + d1_6;
  
  const d3_5 = d3Start + 5 * constantDiff;
  const d2_6 = d2_5 + d3_5;
  const d1_7 = d1_6 + d2_6;
  const pos9 = pos8 + d1_7;
  
  const wrongAnswerPairs = generateWrongAnswerPairs(pos8, pos9, sequence, d1, d2, d3, constantDiff);
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
