export const QUESTION_BANK = {
  Mathematics: {
    mcqs: [
      {
        id: 1,
        question: 'What is the value of 2 + 2?',
        options: ['3', '4', '5', '6'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'What is 10 × 5?',
        options: ['40', '45', '50', '55'],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: 'What is the square root of 144?',
        options: ['10', '11', '12', '13'],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: 'What is 100 ÷ 4?',
        options: ['20', '25', '30', '35'],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: 'What is 7³?',
        options: ['343', '242', '147', '321'],
        correctAnswer: 0,
      },
    ],
    coding: {
      id: 'math_coding_1',
      title: 'Write a function to calculate factorial',
      description: 'Write a JavaScript function that takes a number n and returns its factorial.',
      example: 'factorial(5) should return 120',
      testCases: [
        { input: '5', expected: '120' },
        { input: '3', expected: '6' },
      ],
    },
  },
  Physics: {
    mcqs: [
      {
        id: 1,
        question: 'What is the SI unit of force?',
        options: ['Dyne', 'Newton', 'Pascal', 'Joule'],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: 'What does Einsteins famous equation E=mc² represent?',
        options: ['Energy', 'Momentum', 'Force', 'Acceleration'],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: 'What is the speed of light?',
        options: ['3×10^8 m/s', '3×10^7 m/s', '3×10^9 m/s', '3×10^6 m/s'],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: 'What is the SI unit of energy?',
        options: ['Watt', 'Joule', 'Pascal', 'Newton'],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: 'What is acceleration due to gravity?',
        options: ['8.8 m/s²', '9.8 m/s²', '10.8 m/s²', '7.8 m/s²'],
        correctAnswer: 1,
      },
    ],
    coding: {
      id: 'physics_coding_1',
      title: 'Calculate kinetic energy',
      description: 'Write a function to calculate kinetic energy given mass and velocity. Formula: KE = 0.5 * m * v²',
      example: 'kineticEnergy(2, 5) should return 25',
      testCases: [
        { input: '2, 5', expected: '25' },
        { input: '1, 10', expected: '50' },
      ],
    },
  },
  Chemistry: {
    mcqs: [
      {
        id: 1,
        question: 'What is the atomic number of Carbon?',
        options: ['4', '5', '6', '7'],
        correctAnswer: 2,
      },
      {
        id: 2,
        question: 'What is the chemical formula for table salt?',
        options: ['NaCl', 'KCl', 'CaCl2', 'MgCl2'],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: 'What is the pH of a neutral solution?',
        options: ['0', '7', '14', '1'],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: 'What is the molar mass of H2O?',
        options: ['16', '18', '20', '32'],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: 'What is the oxidation state of Oxygen in most compounds?',
        options: ['+1', '+2', '-2', '-1'],
        correctAnswer: 2,
      },
    ],
    coding: {
      id: 'chemistry_coding_1',
      title: 'Calculate molecular weight',
      description: 'Write a function to calculate the molecular weight of a compound given element symbols and counts.',
      example: 'molWeight("H2O") should return ~18',
      testCases: [
        { input: 'H2O', expected: '18' },
        { input: 'CO2', expected: '44' },
      ],
    },
  },
};
