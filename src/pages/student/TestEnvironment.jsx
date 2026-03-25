import { useState } from 'react';
import MCQTest from '../../components/test/MCQTest';
import CodingTest from '../../components/test/CodingTest';
import { QUESTION_BANK } from '../../data/questionBank';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { submitTestResult } from '../../services/authApi';

const TestEnvironment = ({ subject = 'Mathematics', onTestComplete, onBack }) => {
  const [showInstructions, setShowInstructions] = useState(true);
  const [stage, setStage] = useState('mcq'); // 'mcq' or 'coding'
  const [mcqResults, setMcqResults] = useState(null);
  const [mcqPassed, setMcqPassed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null); // 'success', 'error', null
  const [submissionMessage, setSubmissionMessage] = useState('');

  const subjectData = QUESTION_BANK[subject] || {};
  const questions = subjectData.mcqs || [];
  const problems = subjectData.coding || [];

  // Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userStr = localStorage.getItem('user');
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  };

  const handleMCQSubmit = (results) => {
    setMcqResults(results);
    // Check if score >= 4 to proceed to coding
    if (results.score >= 4) {
      setMcqPassed(true);
      setStage('coding');
    } else {
      setMcqPassed(false);
    }
  };

  const handleCodingSubmit = async (results) => {
    try {
      setIsSubmitting(true);
      setSubmissionStatus(null);

      const currentUser = getCurrentUser();
      if (!currentUser || !currentUser._id) {
        setSubmissionStatus('error');
        setSubmissionMessage('User not found. Please login again.');
        return;
      }

      // Submit test results to backend
      const response = await submitTestResult({
        userId: currentUser._id,
        subject,
        mcqResults,
        codingResults: results,
      });

      setSubmissionStatus('success');
      setSubmissionMessage(
        'Test submitted successfully! Your response has been sent to the admin for approval.'
      );

      // Call the parent callback
      onTestComplete?.({
        subject,
        mcqResults,
        codingResults: results,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error submitting test:', error);
      setSubmissionStatus('error');
      setSubmissionMessage(
        error.message || 'Failed to submit test. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = stage === 'mcq' ? 50 : 100;

  // Instructions Modal
  if (showInstructions) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Test Instructions</h2>
          
          <div className="space-y-4 text-gray-700">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">📋 Test Overview</h3>
              <p>You will complete two parts: MCQ Test (5 questions) and Coding Test (1 problem)</p>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
              <h3 className="font-semibold text-yellow-900 mb-2">⏱️ Time Management</h3>
              <p>• MCQ Test: 10 minutes (2 minutes per question)</p>
              <p>• Coding Test: 10 minutes</p>
              <p className="text-sm mt-2 text-yellow-800">Timer will be visible during the test</p>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <h3 className="font-semibold text-green-900 mb-2">✅ Passing Criteria</h3>
              <p>MCQ: Answer at least 4 out of 5 questions correctly to proceed to coding test</p>
              <p>Coding: Solve the programming problem correctly</p>
              <p className="text-sm mt-2 text-green-800">You must pass both tests to get your leave approved</p>
            </div>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <h3 className="font-semibold text-red-900 mb-2">⚠️ Important Rules</h3>
              <p>• NO CHEATING is tolerated - you must complete the test independently</p>
              <p>• Do NOT refresh the page or leave the test window</p>
              <p>• ❌ <strong>Do NOT copy or paste content</strong> - Any copy/paste attempt will be detected and warned</p>
              <p>• ❌ <strong>Do NOT switch tabs or use Alt+Tab</strong> - Switching away from the test triggers a warning</p>
              <p>• <strong>3 violations will result in automatic test submission</strong></p>
              <p>• Once submitted, answers cannot be changed</p>
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
    <div className="min-h-screen space-y-6 p-4">
      {/* Submission Status Message */}
      {submissionStatus && (
        <div className={`rounded-lg p-6 text-center ${submissionStatus === 'success' ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
          <div className={`text-5xl mb-4 ${submissionStatus === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {submissionStatus === 'success' ? '✅' : '❌'}
          </div>
          <h2 className={`text-2xl font-bold mb-2 ${submissionStatus === 'success' ? 'text-green-700' : 'text-red-700'}`}>
            {submissionStatus === 'success' ? 'Test Submitted!' : 'Submission Failed'}
          </h2>
          <p className={`text-lg mb-6 ${submissionStatus === 'success' ? 'text-green-800' : 'text-red-800'}`}>
            {submissionMessage}
          </p>
          <Button
            onClick={onBack}
            variant="primary"
            className="mx-auto"
          >
            Back to Dashboard
          </Button>
        </div>
      )}

      {/* Only show test content if not submitted */}
      {!submissionStatus && (
        <>
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              disabled={!showInstructions && !!document.fullscreenElement}
              className={`font-semibold text-lg ${
                showInstructions || !document.fullscreenElement
                  ? 'text-blue-600 hover:text-blue-700'
                  : 'text-gray-400 cursor-not-allowed'
              }`}
              title={!showInstructions && document.fullscreenElement ? 'Back button is disabled in fullscreen mode' : 'Go back'}
            >
              ← Back
            </button>
            <div className="w-16"></div>
          </div>

          {/* Stage Indicator */}
          <div className="grid grid-cols-2 gap-4">
            <Card
              className={`${stage === 'mcq' && !mcqPassed ? 'border-blue-500 bg-blue-50' : mcqPassed ? 'border-green-500 bg-green-50' : ''}`}
              title="MCQ Test"
              description={stage === 'mcq' && !mcqPassed ? 'In Progress' : mcqPassed ? 'Passed ✓' : 'Pending'}
            />
            <Card
              className={`${stage === 'coding' ? 'border-blue-500 bg-blue-50' : mcqPassed ? 'border-gray-300' : 'border-gray-200'}`}
              title="Coding Test"
              description={stage === 'coding' ? 'In Progress' : mcqPassed ? 'In Progress' : 'Locked - Pass MCQ first'}
            />
          </div>

          {/* Test Component */}
          <div className="bg-white rounded-lg shadow-md p-2 min-h-[500px]">
            {(stage === 'mcq' && questions && questions.length > 0) || (stage === 'coding' && problems && problems.length > 0) ? (
              stage === 'mcq' ? (
                <MCQTest
                  questions={questions}
                  onSubmit={handleMCQSubmit}
                  subject={subject}
                />
              ) : (
                <CodingTest
                  problems={problems}
                  onSubmit={handleCodingSubmit}
                  subject={subject}
                  isSubmitting={isSubmitting}
                />
              )
            ) : (
              <div className="flex items-center justify-center h-96">
                <div className="text-center">
                  <p className="text-gray-600 text-lg">Loading test content...</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TestEnvironment;
