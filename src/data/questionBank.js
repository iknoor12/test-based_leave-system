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
    coding: [
      {
        id: 'math_coding_1',
        title: 'Write a function to calculate factorial',
        description: 'Write a function named "factorial" that takes a number n and returns its factorial. For example: factorial(5) = 5 × 4 × 3 × 2 × 1 = 120',
        example: 'factorial(5) should return 120\nfactorial(3) should return 6',
        languages: {
          javascript: 'function factorial(n) {\n  // Your code here\n}',
          python: 'def factorial(n):\n    # Your code here\n    pass',
          java: 'public static int factorial(int n) {\n    // Your code here\n}',
        },
      },
      {
        id: 'math_coding_2',
        title: 'Check if a number is prime',
        description: 'Write a function named "isPrime" that takes a number and returns true if it is prime, false otherwise.',
        example: 'isPrime(7) should return true\nisPrime(10) should return false',
        languages: {
          javascript: 'function isPrime(n) {\n  // Your code here\n}',
          python: 'def is_prime(n):\n    # Your code here\n    pass',
          java: 'public static boolean isPrime(int n) {\n    // Your code here\n}',
        },
      },
      {
        id: 'math_coding_3',
        title: 'Find the sum of digits',
        description: 'Write a function named "sumOfDigits" that takes a number and returns the sum of its digits.',
        example: 'sumOfDigits(123) should return 6\nsumOfDigits(999) should return 27',
        languages: {
          javascript: 'function sumOfDigits(n) {\n  // Your code here\n}',
          python: 'def sum_of_digits(n):\n    # Your code here\n    pass',
          java: 'public static int sumOfDigits(int n) {\n    // Your code here\n}',
        },
      },
      {
        id: 'math_coding_4',
        title: 'Calculate Fibonacci number',
        description: 'Write a function named "fibonacci" that returns the nth Fibonacci number.',
        example: 'fibonacci(5) should return 5\nfibonacci(6) should return 8',
        languages: {
          javascript: 'function fibonacci(n) {\n  // Your code here\n}',
          python: 'def fibonacci(n):\n    # Your code here\n    pass',
          java: 'public static int fibonacci(int n) {\n    // Your code here\n}',
        },
      },
      {
        id: 'math_coding_5',
        title: 'Find GCD of two numbers',
        description: 'Write a function named "gcd" that finds the greatest common divisor of two numbers.',
        example: 'gcd(12, 8) should return 4\ngcd(35, 49) should return 7',
        languages: {
          javascript: 'function gcd(a, b) {\n  // Your code here\n}',
          python: 'def gcd(a, b):\n    # Your code here\n    pass',
          java: 'public static int gcd(int a, int b) {\n    // Your code here\n}',
        },
      },
    ],
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
    coding: [
      {
        id: 'physics_coding_1',
        title: 'Calculate kinetic energy',
        description: 'Write a function named "kineticEnergy" that calculates kinetic energy given mass (m) and velocity (v). Formula: KE = 0.5 × m × v²',
        example: 'kineticEnergy(2, 5) should return 25\nkineticEnergy(1, 10) should return 50',
        languages: {
          javascript: 'function kineticEnergy(m, v) {\n  // Your code here\n}',
          python: 'def kinetic_energy(m, v):\n    # Your code here\n    pass',
          java: 'public static double kineticEnergy(double m, double v) {\n    // Your code here\n}',
        },
      },
      {
        id: 'physics_coding_2',
        title: 'Calculate force',
        description: 'Write a function named "calculateForce" that calculates force using F = m × a.',
        example: 'calculateForce(5, 10) should return 50',
        languages: {
          javascript: 'function calculateForce(m, a) {\n  // Your code here\n}',
          python: 'def calculate_force(m, a):\n    # Your code here\n    pass',
          java: 'public static double calculateForce(double m, double a) {\n    // Your code here\n}',
        },
      },
      {
        id: 'physics_coding_3',
        title: 'Calculate gravitational potential energy',
        description: 'Write a function named "potentialEnergy" that calculates PE = m × g × h.',
        example: 'potentialEnergy(10, 9.8, 5) should return 490',
        languages: {
          javascript: 'function potentialEnergy(m, g, h) {\n  // Your code here\n}',
          python: 'def potential_energy(m, g, h):\n    # Your code here\n    pass',
          java: 'public static double potentialEnergy(double m, double g, double h) {\n    // Your code here\n}',
        },
      },
      {
        id: 'physics_coding_4',
        title: 'Calculate velocity',
        description: 'Write a function named "calculateVelocity" that calculates velocity using v = u + at.',
        example: 'calculateVelocity(5, 2, 10) should return 25',
        languages: {
          javascript: 'function calculateVelocity(u, a, t) {\n  // Your code here\n}',
          python: 'def calculate_velocity(u, a, t):\n    # Your code here\n    pass',
          java: 'public static double calculateVelocity(double u, double a, double t) {\n    // Your code here\n}',
        },
      },
      {
        id: 'physics_coding_5',
        title: 'Calculate distance',
        description: 'Write a function named "calculateDistance" that calculates distance using s = ut + 0.5 × a × t².',
        example: 'calculateDistance(10, 2, 5) should return 75',
        languages: {
          javascript: 'function calculateDistance(u, t, a) {\n  // Your code here\n}',
          python: 'def calculate_distance(u, t, a):\n    # Your code here\n    pass',
          java: 'public static double calculateDistance(double u, double t, double a) {\n    // Your code here\n}',
        },
      },
    ],
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
    coding: [
      {
        id: 'chemistry_coding_1',
        title: 'Calculate molecular weight of water',
        description: 'Write a function named "waterMolWeight" that returns the molecular weight of H₂O. (H=1, O=16, so H₂O = 2×1 + 16 = 18)',
        example: 'waterMolWeight() should return 18',
        languages: {
          javascript: 'function waterMolWeight() {\n  // Your code here\n}',
          python: 'def water_mol_weight():\n    # Your code here\n    pass',
          java: 'public static int waterMolWeight() {\n    // Your code here\n}',
        },
      },
      {
        id: 'chemistry_coding_2',
        title: 'Calculate molarity',
        description: 'Write a function named "calculateMolarity" that calculates molarity = moles / volume (in liters).',
        example: 'calculateMolarity(1, 0.5) should return 2',
        languages: {
          javascript: 'function calculateMolarity(moles, volume) {\n  // Your code here\n}',
          python: 'def calculate_molarity(moles, volume):\n    # Your code here\n    pass',
          java: 'public static double calculateMolarity(double moles, double volume) {\n    // Your code here\n}',
        },
      },
      {
        id: 'chemistry_coding_3',
        title: 'Convert Celsius to Kelvin',
        description: 'Write a function named "celsiusToKelvin" that converts temperature from Celsius to Kelvin. K = C + 273.15',
        example: 'celsiusToKelvin(25) should return 298.15',
        languages: {
          javascript: 'function celsiusToKelvin(celsius) {\n  // Your code here\n}',
          python: 'def celsius_to_kelvin(celsius):\n    # Your code here\n    pass',
          java: 'public static double celsiusToKelvin(double celsius) {\n    // Your code here\n}',
        },
      },
      {
        id: 'chemistry_coding_4',
        title: 'Calculate percent composition',
        description: 'Write a function named "percentComposition" that calculates percent composition = (mass of element / total mass) × 100.',
        example: 'percentComposition(1, 18) should return 5.56',
        languages: {
          javascript: 'function percentComposition(elementMass, totalMass) {\n  // Your code here\n}',
          python: 'def percent_composition(element_mass, total_mass):\n    # Your code here\n    pass',
          java: 'public static double percentComposition(double elementMass, double totalMass) {\n    // Your code here\n}',
        },
      },
      {
        id: 'chemistry_coding_5',
        title: 'Calculate pH from hydrogen ion concentration',
        description: 'Write a function named "calculatePH" that calculates pH = -log10([H+]).',
        example: 'calculatePH(0.001) should return 3',
        languages: {
          javascript: 'function calculatePH(concentration) {\n  // Your code here\n}',
          python: 'def calculate_ph(concentration):\n    # Your code here\n    pass',
          java: 'public static double calculatePH(double concentration) {\n    // Your code here\n}',
        },
      },
    ],
  },
  JavaScript: {
    mcqs: [
      {
        id: 1,
        question: 'Which keyword is used to declare a constant in JavaScript?',
        options: ['var', 'let', 'const', 'static'],
        correctAnswer: 2,
      },
      {
        id: 2,
        question: 'What is the output of: typeof null?',
        options: ['"null"', '"object"', '"undefined"', '"number"'],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: 'Which method is used to add an element to the end of an array?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: 'What does "===" operator do in JavaScript?',
        options: ['Assigns value', 'Compares value only', 'Compares value and type', 'Logical AND'],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: 'Which of these is NOT a JavaScript data type?',
        options: ['string', 'boolean', 'float', 'undefined'],
        correctAnswer: 2,
      },
    ],
    coding: [
      {
        id: 'javascript_coding_1',
        title: 'Reverse a string',
        description: 'Write a function named "reverseString" that takes a string as input and returns the reversed string. For example: reverseString("hello") should return "olleh"',
        example: 'reverseString("hello") should return "olleh"\nreverseString("world") should return "dlrow"',
        languages: {
          javascript: 'function reverseString(str) {\n  // Your code here\n}',
          python: 'def reverse_string(s):\n    # Your code here\n    pass',
          java: 'public static String reverseString(String str) {\n    // Your code here\n}',
        },
      },
      {
        id: 'javascript_coding_2',
        title: 'Check if string is palindrome',
        description: 'Write a function named "isPalindrome" that checks if a string is a palindrome.',
        example: 'isPalindrome("racecar") should return true\nisPalindrome("hello") should return false',
        languages: {
          javascript: 'function isPalindrome(str) {\n  // Your code here\n}',
          python: 'def is_palindrome(s):\n    # Your code here\n    pass',
          java: 'public static boolean isPalindrome(String str) {\n    // Your code here\n}',
        },
      },
      {
        id: 'javascript_coding_3',
        title: 'Count vowels in string',
        description: 'Write a function named "countVowels" that counts the number of vowels in a string.',
        example: 'countVowels("hello") should return 2\ncountVowels("javascript") should return 3',
        languages: {
          javascript: 'function countVowels(str) {\n  // Your code here\n}',
          python: 'def count_vowels(s):\n    # Your code here\n    pass',
          java: 'public static int countVowels(String str) {\n    // Your code here\n}',
        },
      },
      {
        id: 'javascript_coding_4',
        title: 'Remove duplicates from array',
        description: 'Write a function named "removeDuplicates" that removes duplicate elements from an array.',
        example: 'removeDuplicates([1,2,2,3,3,3]) should return [1,2,3]',
        languages: {
          javascript: 'function removeDuplicates(arr) {\n  // Your code here\n}',
          python: 'def remove_duplicates(arr):\n    # Your code here\n    pass',
          java: 'public static int[] removeDuplicates(int[] arr) {\n    // Your code here\n}',
        },
      },
      {
        id: 'javascript_coding_5',
        title: 'Find second largest number',
        description: 'Write a function named "secondLargest" that finds the second largest number in an array.',
        example: 'secondLargest([1,5,3,9,2]) should return 5',
        languages: {
          javascript: 'function secondLargest(arr) {\n  // Your code here\n}',
          python: 'def second_largest(arr):\n    # Your code here\n    pass',
          java: 'public static int secondLargest(int[] arr) {\n    // Your code here\n}',
        },
      },
    ],
  },
};
