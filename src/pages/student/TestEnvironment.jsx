import { useState } from 'react';
import MCQTest from '../../components/test/MCQTest';
import CodingTest from '../../components/test/CodingTest';
import { QUESTION_BANK } from '../../data/questionBank';
import Card from '../../components/common/Card';

const TestEnvironment = ({ subject = 'Mathematics', onTestComplete, onBack }) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{subject} Test</h1>
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-700 font-semibold"
        >
          Exit Test
        </button>
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
