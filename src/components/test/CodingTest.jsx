import { useState } from 'react';
import Timer from '../common/Timer';
import Button from '../common/Button';

const CodingTest = ({ problem = {}, onSubmit, subject = 'Mathematics' }) => {
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [output, setOutput] = useState('');

  const handleRunCode = () => {
    try {
      // Simulate code execution - in production, use backend service
      setOutput('Code executed successfully (mock)');
    } catch (error) {
      setOutput(`Error: ${error.message}`);
    }
  };

  const handleSubmit = () => {
    setSubmitted(true);
    onSubmit?.({ code, subject });
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

          {problem.testCases && problem.testCases.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Test Cases:</h4>
              <div className="space-y-2">
                {problem.testCases.map((tc, idx) => (
                  <div key={idx} className="bg-gray-50 p-2 rounded text-sm">
                    <p className="text-gray-700">Input: <span className="font-mono">{tc.input}</span></p>
                    <p className="text-gray-700">Expected: <span className="font-mono">{tc.expected}</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}
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
            <div className="bg-gray-100 rounded-lg p-4 max-h-40 overflow-y-auto">
              <p className="text-xs font-semibold text-gray-600 mb-2">Output:</p>
              <p className="text-sm font-mono text-gray-800">{output}</p>
            </div>
          )}

          <div className="flex gap-4">
            <Button onClick={handleRunCode} variant="secondary">
              Run Code
            </Button>
            <Button onClick={handleSubmit} variant="success">
              Submit Solution
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingTest;
