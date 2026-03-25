import { useState, useEffect } from 'react';
import Timer from '../common/Timer';
import Button from '../common/Button';

const CodingTest = ({ problems = [], onSubmit, subject = 'Mathematics', isSubmitting = false }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [solutions, setSolutions] = useState({}); // Store solutions for each question
  const [currentCode, setCurrentCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [codingScores, setCodingScores] = useState({}); // Score for each question
  const [showCheatingWarning, setShowCheatingWarning] = useState(false);
  const [cheatingWarningType, setCheatingWarningType] = useState('');
  const [cheatingCount, setCheatingCount] = useState(0);

  const currentProblem = problems[currentQuestionIndex];

  // Initialize code when question or language changes
  useEffect(() => {
    const questionId = currentProblem?.id;
    if (questionId && solutions[questionId] && solutions[questionId][selectedLanguage]) {
      setCurrentCode(solutions[questionId][selectedLanguage]);
    } else if (currentProblem?.languages?.[selectedLanguage]) {
      setCurrentCode(currentProblem.languages[selectedLanguage]);
    } else {
      setCurrentCode('');
    }
    setOutput('');
    setIsCorrect(false);
    setHasError(false);
  }, [currentQuestionIndex, selectedLanguage, problems, solutions]);

  // Cheating detection
  useEffect(() => {
    if (submitted) return;

    const requestFullscreen = async () => {
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
      } catch (err) {
        console.log('Fullscreen request failed');
      }
    };

    requestFullscreen();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setShowCheatingWarning(true);
        setCheatingWarningType('tab');
        setCheatingCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            handleFinalSubmit();
          }
          return newCount;
        });
        setTimeout(() => setShowCheatingWarning(false), 3000);
      }
    };

    const handleCopy = (e) => {
      e.preventDefault();
      setShowCheatingWarning(true);
      setCheatingWarningType('copy');
      setCheatingCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          handleFinalSubmit();
        }
        return newCount;
      });
      setTimeout(() => setShowCheatingWarning(false), 3000);
    };

    const handlePaste = (e) => {
      e.preventDefault();
      setShowCheatingWarning(true);
      setCheatingWarningType('copy');
      setCheatingCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 3) {
          handleFinalSubmit();
        }
        return newCount;
      });
      setTimeout(() => setShowCheatingWarning(false), 3000);
    };

    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      if (e.key === 'Tab' && (e.altKey || e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setShowCheatingWarning(true);
        setCheatingWarningType('tab');
        setCheatingCount((prev) => {
          const newCount = prev + 1;
          if (newCount >= 3) {
            handleFinalSubmit();
          }
          return newCount;
        });
        setTimeout(() => setShowCheatingWarning(false), 3000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [submitted]);

  // Exit fullscreen when test is completed
  useEffect(() => {
    if (!submitted) return;

    const exitFullscreen = async () => {
      try {
        if (document.fullscreenElement) {
          await document.exitFullscreen();
        } else if (document.webkitFullscreenElement) {
          await document.webkitCancelFullScreen();
        } else if (document.msFullscreenElement) {
          await document.msExitFullscreen();
        }
      } catch (err) {
        console.log('Exit fullscreen failed:', err);
      }
    };

    exitFullscreen();
  }, [submitted]);

  const saveSolution = () => {
    if (!currentProblem) return;
    const questionId = currentProblem.id;
    setSolutions((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || {}),
        [selectedLanguage]: currentCode,
      },
    }));
  };

  const handleRunCode = () => {
    setIsExecuting(true);
    setOutput('');
    setHasError(false);
    setIsCorrect(false);
    
    try {
      let consoleOutput = [];
      const originalLog = console.log;
      const originalError = console.error;
      
      console.log = (...args) => {
        consoleOutput.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };
      
      console.error = (...args) => {
        consoleOutput.push('ERROR: ' + args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      try {
        const buildValidation = (pid) => {
          if (!pid) return 'return { __passed: true, __tests: [] };';
          const validations = {
            'math_coding_1': `
              let __tests = [];
              try {
                const r1 = factorial(5);
                const r2 = factorial(3);
                __tests.push({ name: 'factorial(5)', expected: 120, actual: r1, passed: r1 === 120 });
                __tests.push({ name: 'factorial(3)', expected: 6, actual: r2, passed: r2 === 6 });
              } catch (e) {
                return { __error: e };
              }
              const __passed = __tests.every(t => t.passed);
              return { __passed, __tests };
            `,
            'math_coding_2': `
              let __tests = [];
              try {
                const r1 = isPrime(7);
                const r2 = isPrime(10);
                __tests.push({ name: 'isPrime(7)', expected: true, actual: r1, passed: r1 === true });
                __tests.push({ name: 'isPrime(10)', expected: false, actual: r2, passed: r2 === false });
              } catch (e) {
                return { __error: e };
              }
              const __passed = __tests.every(t => t.passed);
              return { __passed, __tests };
            `,
            'math_coding_3': `
              let __tests = [];
              try {
                const r1 = sumOfDigits(123);
                const r2 = sumOfDigits(999);
                __tests.push({ name: 'sumOfDigits(123)', expected: 6, actual: r1, passed: r1 === 6 });
                __tests.push({ name: 'sumOfDigits(999)', expected: 27, actual: r2, passed: r2 === 27 });
              } catch (e) {
                return { __error: e };
              }
              const __passed = __tests.every(t => t.passed);
              return { __passed, __tests };
            `,
            'physics_coding_1': `
              let __tests = [];
              try {
                const r1 = kineticEnergy(2, 5);
                const r2 = kineticEnergy(1, 10);
                __tests.push({ name: 'kineticEnergy(2,5)', expected: 25, actual: r1, passed: r1 === 25 });
                __tests.push({ name: 'kineticEnergy(1,10)', expected: 50, actual: r2, passed: r2 === 50 });
              } catch (e) {
                return { __error: e };
              }
              const __passed = __tests.every(t => t.passed);
              return { __passed, __tests };
            `,
            'chemistry_coding_1': `
              let __tests = [];
              try {
                const r1 = waterMolWeight();
                __tests.push({ name: 'waterMolWeight()', expected: 18, actual: r1, passed: r1 === 18 });
              } catch (e) {
                return { __error: e };
              }
              const __passed = __tests.every(t => t.passed);
              return { __passed, __tests };
            `,
            'javascript_coding_1': `
              let __tests = [];
              try {
                const r1 = reverseString('hello');
                const r2 = reverseString('world');
                __tests.push({ name: 'reverseString("hello")', expected: 'olleh', actual: r1, passed: r1 === 'olleh' });
                __tests.push({ name: 'reverseString("world")', expected: 'dlrow', actual: r2, passed: r2 === 'dlrow' });
              } catch (e) {
                return { __error: e };
              }
              const __passed = __tests.every(t => t.passed);
              return { __passed, __tests };
            `,
          };
          return validations[pid] || 'return { __passed: true, __tests: [] };';
        };

        const fullCode = currentCode + '\n\n' + buildValidation(currentProblem?.id);
        const result = new Function(fullCode)();

        console.log = originalLog;
        console.error = originalError;

        let outputMessage = '';
        if (result.__error) {
          setOutput(`❌ Error: ${result.__error.message}`);
          setHasError(true);
          setIsCorrect(false);
          setCodingScores((prev) => ({
            ...prev,
            [currentProblem?.id]: 0,
          }));
        } else if (result.__tests && result.__tests.length > 0) {
          const passedAll = result.__tests.every((t) => t.passed);
          const passedCount = result.__tests.filter((t) => t.passed).length;
          const score = Math.round((passedCount / result.__tests.length) * 100);
          
          setIsCorrect(passedAll);
          setCodingScores((prev) => ({
            ...prev,
            [currentProblem?.id]: score,
          }));

          const details = result.__tests.map((t) => 
            `${t.passed ? '✓' : '✗'} ${t.name}: expected ${t.expected}, got ${t.actual}`
          ).join('\n');
          outputMessage += (passedAll ? '✓ Correct solution!\n' : '✗ Incorrect solution.\n') + '\n' + details;
          setHasError(!passedAll);
        } else {
          const passed = !!result.__passed;
          setIsCorrect(passed);
          setCodingScores((prev) => ({
            ...prev,
            [currentProblem?.id]: passed ? 100 : 0,
          }));
          setHasError(!passed);
          outputMessage += passed ? '✓ Correct solution!' : '✗ Incorrect solution.';
        }
        
        if (outputMessage === '') {
          outputMessage = '✓ Code executed successfully (no output).';
        }
        
        setOutput(outputMessage);
        
      } catch (execError) {
        console.log = originalLog;
        console.error = originalError;
        
        setOutput(`❌ Runtime Error:\n\nError: ${execError.name}\nMessage: ${execError.message}`);
        setHasError(true);
        setIsCorrect(false);
        setCodingScores((prev) => ({
          ...prev,
          [currentProblem.id]: 0,
        }));
      }
      
    } catch (error) {
      setOutput(`❌ Execution Error:\n\nError: ${error.name}\nMessage: ${error.message}`);
      setHasError(true);
      setIsCorrect(false);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleNextQuestion = () => {
    saveSolution();
    if (currentQuestionIndex < problems.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    saveSolution();
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleFinalSubmit = () => {
    saveSolution();
    setSubmitted(true);
    
    // Calculate overall score
    const totalScore = Object.values(codingScores).reduce((sum, score) => sum + score, 0);
    const averageScore = problems.length > 0 ? Math.round(totalScore / problems.length) : 0;

    onSubmit?.({
      code: solutions,
      subject,
      isCorrect: averageScore >= 80,
      codingScore: averageScore,
      totalQuestions: problems.length,
    });
  };

  const handleTimeUp = () => {
    handleFinalSubmit();
  };

  if (!problems || problems.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No coding problems available</p>
      </div>
    );
  }

  if (!currentProblem) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Loading question...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Submission Received</h2>
        <p className="text-gray-600 mb-4">Your coding solutions have been submitted for evaluation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">{subject} - Coding Test</h2>
        <Timer duration={600} onTimeUp={handleTimeUp} />
      </div>

      {/* Question Indicator */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="font-semibold text-blue-900">Question {currentQuestionIndex + 1} of {problems.length}</p>
          <span className="text-sm text-blue-700">Progress: {Math.round(((currentQuestionIndex + 1) / problems.length) * 100)}%</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${((currentQuestionIndex + 1) / problems.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Section */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">{currentProblem.title}</h3>
          <p className="text-gray-700">{currentProblem.description}</p>
          
          {currentProblem.example && (
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm font-mono text-gray-800 whitespace-pre-wrap">{currentProblem.example}</p>
            </div>
          )}
        </div>

        {/* Code Editor Section */}
        <div className="space-y-4">
          {/* Language Selector */}
          <div className="bg-white rounded-lg shadow-md p-4">
            <label className="block text-sm font-semibold text-gray-900 mb-3">Select Programming Language</label>
            <div className="flex gap-2">
              {['javascript', 'python', 'java'].map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-2 rounded-lg font-semibold transition ${
                    selectedLanguage === lang
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                  }`}
                >
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-900 text-white p-3 font-semibold">Code Editor ({selectedLanguage})</div>
            <textarea
              value={currentCode}
              onChange={(e) => setCurrentCode(e.target.value)}
              placeholder="// Write your solution here..."
              className="w-full h-64 p-4 font-mono text-sm border-t border-gray-200 focus:outline-none"
            />
          </div>

          {output && (
            <div className={`rounded-lg p-4 max-h-48 overflow-y-auto border-2 ${
              hasError
                ? 'bg-red-50 border-red-300' 
                : 'bg-green-50 border-green-300'
            }`}>
              <p className={`text-xs font-semibold mb-2 ${
                hasError
                  ? 'text-red-700' 
                  : 'text-green-700'
              }`}>
                {hasError ? '⚠️ Output (Error)' : (isCorrect ? '✓ Output (Correct)' : '⚠️ Output (Incorrect)')}
              </p>
              <pre className={`text-sm font-mono whitespace-pre-wrap ${
                hasError
                  ? 'text-red-800' 
                  : 'text-green-800'
              }`}>{output}</pre>
            </div>
          )}

          <div className="flex gap-4">
            <Button 
              onClick={handleRunCode} 
              variant="primary"
              disabled={isExecuting || !currentCode.trim() || isSubmitting}
            >
              {isExecuting ? 'Running...' : 'Run Code'}
            </Button>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            <Button 
              onClick={handlePreviousQuestion}
              variant="secondary"
              disabled={currentQuestionIndex === 0}
            >
              ← Previous
            </Button>
            {currentQuestionIndex === problems.length - 1 ? (
              <Button 
                onClick={handleFinalSubmit}
                variant="success"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Submitting...' : '✓ Submit All Answers'}
              </Button>
            ) : (
              <Button 
                onClick={handleNextQuestion}
                variant="secondary"
              >
                Next →
              </Button>
            )}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              💡 You can write and test code for each question. Your solutions are auto-saved when you navigate between questions.
            </p>
          </div>

          {/* Cheating Warning Modal */}
          {showCheatingWarning && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
                <div className="text-center">
                  <div className="text-red-600 text-5xl mb-4">⚠️</div>
                  <h2 className="text-2xl font-bold text-red-700 mb-2">
                    {cheatingWarningType === 'tab' ? 'Tab Switch Detected!' : 'Copy/Paste Not Allowed!'}
                  </h2>
                  <p className="text-gray-700 mb-4 font-semibold">
                    {cheatingWarningType === 'tab'
                      ? "You switched away from the coding test."
                      : "Copying or pasting is not permitted."}
                  </p>
                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                    <p className="text-sm text-yellow-800">
                      <strong>Warning {cheatingCount} of 3:</strong> One more violation will auto-submit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodingTest;
