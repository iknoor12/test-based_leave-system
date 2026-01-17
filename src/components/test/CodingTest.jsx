import { useState } from 'react';
import Timer from '../common/Timer';
import Button from '../common/Button';

const CodingTest = ({ problem = {}, onSubmit, subject = 'Mathematics' }) => {
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [output, setOutput] = useState('');
  const [isExecuting, setIsExecuting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [codingScore, setCodingScore] = useState(0);
  const [passedTests, setPassedTests] = useState(0);
  const [totalTests, setTotalTests] = useState(0);

  const handleRunCode = () => {
    setIsExecuting(true);
    setOutput('');
    setHasError(false);
    setIsCorrect(false);
    
    try {
      // Capture console.log output
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
        // Build validation snippet based on problem id
        const buildValidation = (pid) => {
          switch (pid) {
            case 'math_coding_1':
              return `
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
              `;
            case 'physics_coding_1':
              return `
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
              `;
            case 'chemistry_coding_1':
              return `
                let __tests = [];
                try {
                  const r1 = waterMolWeight();
                  __tests.push({ name: 'waterMolWeight()', expected: 18, actual: r1, passed: r1 === 18 });
                } catch (e) {
                  return { __error: e };
                }
                const __passed = __tests.every(t => t.passed);
                return { __passed, __tests };
              `;
            default:
              return `return { __passed: true, __tests: [] };`;
          }
        };

        // Execute the user's code and run validation in the same scope
        const wrappedCode = `
          (function() {
            ${code}
            ${buildValidation(problem.id)}
          })();
        `;
        
        const validation = eval(wrappedCode);
        
        // Restore console methods
        console.log = originalLog;
        console.error = originalError;
        
        // Build output message
        let outputMessage = '';
        
        if (consoleOutput.length > 0) {
          outputMessage += '=== Console Output ===\n' + consoleOutput.join('\n') + '\n\n';
        }
        
        if (validation && validation.__error) {
          const execError = validation.__error;
          setOutput(`❌ Runtime Error:\n\nError: ${execError.name}\nMessage: ${execError.message}\n\nStack Trace:\n${execError.stack || 'No stack trace available'}`);
          setHasError(true);
          setIsCorrect(false);
          return;
        }

        if (validation && validation.__tests && validation.__tests.length > 0) {
          const tests = validation.__tests;
          const passedCount = tests.filter(t => t.passed).length;
          const totalCount = tests.length;
          const passedAll = passedCount === totalCount;
          setIsCorrect(passedAll);
          setPassedTests(passedCount);
          setTotalTests(totalCount);
          setCodingScore(Math.round((passedCount / totalCount) * 100));
          const details = tests.map(t => 
            `${t.name}: ${t.passed ? '✓ PASSED' : '✗ FAILED'} (expected ${t.expected}, got ${t.actual})`
          ).join('\n');
          outputMessage += (passedAll ? '✓ Correct solution!\n' : '✗ Incorrect solution.\n') + '\n' + details;
          setHasError(!passedAll);
        }

        if (validation && (!validation.__tests || validation.__tests.length === 0)) {
          // No explicit tests available; use validation.__passed to set score
          const passed = !!validation.__passed;
          setIsCorrect(passed);
          setCodingScore(passed ? 100 : 0);
          setPassedTests(passed ? 1 : 0);
          setTotalTests(1);
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
        
        setOutput(`❌ Runtime Error:\n\nError: ${execError.name}\nMessage: ${execError.message}\n\nStack Trace:\n${execError.stack || 'No stack trace available'}`);
        setHasError(true);
        setIsCorrect(false);
      }
      
    } catch (error) {
      setOutput(`❌ Execution Error:\n\nError: ${error.name}\nMessage: ${error.message}\n\n${error.stack || ''}`);
      setHasError(true);
      setIsCorrect(false);
    } finally {
      setIsExecuting(false);
    }
  };

  const handleSubmit = () => {
    // Submit current execution result info
    setSubmitted(true);
    onSubmit?.({ 
      code, 
      subject,
      isCorrect,
      output,
      hasError,
      codingScore,
      passedTests,
      totalTests,
    });
  };

  const handleTimeUp = () => {
    handleSubmit();
  };

  if (!problem || !problem.id) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No problem available</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Submission Received</h2>
        <p className="text-gray-600 mb-4">Your code has been submitted for evaluation.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">{subject} - Coding Test</h2>
        <Timer duration={600} onTimeUp={handleTimeUp} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Section */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">{problem.title}</h3>
          <p className="text-gray-700">{problem.description}</p>
          
          {problem.example && (
            <div className="bg-gray-100 p-3 rounded-lg">
              <p className="text-sm font-mono text-gray-800">{problem.example}</p>
            </div>
          )}

          {/* Test cases removed as per requirement */}
        </div>

        {/* Code Editor Section */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-900 text-white p-3 font-semibold">Code Editor</div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="// Write your solution here..."
              className="w-full h-64 p-4 font-mono text-sm border-t border-gray-200 focus:outline-none"
            />
          </div>

          {output && (
            <div className={`rounded-lg p-4 max-h-64 overflow-y-auto border-2 ${
              hasError
                ? 'bg-red-50 border-red-300' 
                : 'bg-green-50 border-green-300'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <p className={`text-xs font-semibold ${
                  hasError
                    ? 'text-red-700' 
                    : 'text-green-700'
                }`}>
                  {hasError ? '⚠️ Output (Error)' : (isCorrect ? '✓ Output (Correct)' : '⚠️ Output (Incorrect)')}
                </p>
              </div>
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
              disabled={isExecuting || !code.trim()}
            >
              {isExecuting ? 'Running...' : 'Run Code'}
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="success"
              disabled={!code.trim()}
            >
              Submit Solution
            </Button>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              💡 <strong>Instructions:</strong> Write your function and click "Run Code". You'll see output or errors, and validation against the expected answer. Submit when it's correct.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CodingTest;
