import { useState } from 'react';
import MCQTest from '../../components/test/MCQTest';
import CodingTest from '../../components/test/CodingTest';
import { QUESTION_BANK } from '../../data/questionBank';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const TestEnvironment = ({ subject = 'Mathematics', onTestComplete, onBack }) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [stage, setStage] = useState('mcq'); // 'mcq' or 'coding'
  const [mcqResults, setMcqResults] = useState(null);

  const subjectData = QUESTION_BANK[subject] || {};
  const questions = subjectData.mcqs || [];
  const problem = subjectData.coding || {};

  const handleMCQSubmit = (results) => {
    setMcqResults(results);
    setStage('coding');
  };

  const handleCodingSubmit = (results) => {
    onTestComplete?.({
      subject,
      mcqResults,
      codingResults: results,
      timestamp: new Date().toISOString(),
    });
  };

  const progress = stage === 'mcq' ? 50 : 100;

  // Instructions Modal
  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Test Instructions</h2>
          
          <div className="space-y-4 text-gray-700">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Test Overview</h3>
              <p>You will complete two parts: MCQ Test (5 questions) and Coding Test (1 problem)</p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <h3 className="font-semibold text-yellow-900 mb-2">⏱️ Time Management</h3>
              <p>• MCQ Test: 10 minutes (2 minutes per question)</p>
              <p>• Coding Test: 15 minutes</p>
              <p className="text-sm mt-2 text-yellow-800">Timer will be visible during the test</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h3 className="font-semibold text-green-900 mb-2">✅ Passing Criteria</h3>
              <p>You need a combined score of 70% or higher to get your leave approved</p>
              <p className="text-sm mt-2 text-green-800">Score = 60% MCQ + 40% Coding</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <h3 className="font-semibold text-red-900 mb-2">⚠️ Important Rules</h3>
              <p>• NO CHEATING is tolerated - you must complete the test independently</p>
              <p>• Do NOT refresh the page or leave the test window</p>
              <p>• Once submitted, answers cannot be changed</p>
              <p>• Any malpractice will result in automatic rejection</p>
            </div>

            <div className="bg-gray-50 border-l-4 border-gray-500 p-4 rounded">
              <h3 className="font-semibold text-gray-900 mb-2">📝 Total Questions</h3>
              <p>• MCQ: 5 multiple choice questions</p>
              <p>• Coding: 1 programming problem</p>
            </div>
          </div>

          <div className="mt-8 flex gap-4">
            <Button onClick={onBack} variant="secondary" className="flex-1">
              Cancel Test
            </Button>
            <Button 
              onClick={() => setShowInstructions(false)} 
              variant="primary" 
              className="flex-1"
            >
              I Understand - Start Test
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{subject} Test</h1>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-gray-700">Test Progress</span>
          <span className="text-sm font-semibold text-gray-700">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Stage Indicator */}
      <div className="grid grid-cols-2 gap-4">
        <Card
          className={`${stage === 'mcq' ? 'border-blue-500 bg-blue-50' : ''}`}
          title="MCQ Test"
          description={stage === 'mcq' ? 'In Progress' : 'Completed'}
        />
        <Card
          className={`${stage === 'coding' ? 'border-blue-500 bg-blue-50' : ''}`}
          title="Coding Test"
          description={stage === 'coding' ? 'In Progress' : 'Pending'}
        />
      </div>

      {/* Test Component */}
      <div className="bg-white rounded-lg shadow-md p-8">
        {stage === 'mcq' ? (
          <MCQTest
            questions={questions}
            onSubmit={handleMCQSubmit}
            subject={subject}
          />
        ) : (
          <CodingTest
            problem={problem}
            onSubmit={handleCodingSubmit}
            subject={subject}
          />
        )}
      </div>
    </div>
  );
};

export default TestEnvironment;
