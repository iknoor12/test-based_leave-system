import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const TestResults = ({ testData, leaveData, onBackToDashboard }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  // Calculate scores
  const mcqScore = testData?.mcqResults?.score || 0;
  const totalMcq = testData?.mcqResults?.totalQuestions || 5;
  const mcqPercentage = ((mcqScore / totalMcq) * 100).toFixed(0);
  
  // Coding score
  const codingScore = testData?.codingResults?.codingScore || 0;
  const passedTests = testData?.codingResults?.passedTests || 0;
  const totalTests = testData?.codingResults?.totalTests || 0;
  
  // Combined score (60% MCQ + 40% Coding)
  const combinedScore = Math.round(parseInt(mcqPercentage) * 0.6 + codingScore * 0.4);

  // Determine approval based on combined score (70% threshold)
  const isApproved = combinedScore >= 70;

  useEffect(() => {
    if (isApproved) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isApproved]);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-900">Test Completed!</h1>
        <p className="text-gray-600">Your results are ready</p>
      </div>

      {/* Approval Status Banner */}
      <div
        className={`rounded-lg p-8 text-center ${
          isApproved
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300'
            : 'bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300'
        }`}
      >
        <div className="flex justify-center mb-4">
          {isApproved ? (
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          ) : (
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          )}
        </div>

        <h2 className={`text-3xl font-bold mb-2 ${isApproved ? 'text-green-700' : 'text-red-700'}`}>
          {isApproved ? 'Leave Request Approved! 🎉' : 'Leave Request Rejected'}
        </h2>
        <p className={`text-lg ${isApproved ? 'text-green-600' : 'text-red-600'}`}>
          {isApproved
            ? 'Congratulations! You passed the test and your leave has been approved.'
            : 'Unfortunately, you did not meet the minimum combined score requirement of 70%.'}
        </p>
      </div>

      {/* Test Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card
          title="MCQ Score"
          value={`${mcqScore}/${totalMcq}`}
          description={`${mcqPercentage}% Correct`}
          className={parseInt(mcqPercentage) >= 70 ? 'border-green-300' : 'border-red-300'}
        />
        <Card
          title="Coding Score"
          value={`${codingScore}%`}
          description={`${passedTests}/${totalTests} tests passed`}
          className={codingScore >= 70 ? 'border-green-300' : 'border-red-300'}
        />
        <Card
          title="Combined Score"
          value={`${combinedScore}%`}
          description="Final Score"
          className={combinedScore >= 70 ? 'border-green-300 bg-green-50' : 'border-red-300 bg-red-50'}
        />
        <Card
          title="Status"
          value={isApproved ? 'Approved' : 'Rejected'}
          description={isApproved ? 'Leave Granted' : 'Reapply Available'}
          className={isApproved ? 'border-green-300' : 'border-red-300'}
        />
      </div>

      {/* Leave Details */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Leave Request Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500 font-semibold">Reason:</p>
            <p className="text-gray-900">{leaveData?.reason || 'Not provided'}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold">Duration:</p>
            <p className="text-gray-900">
              {leaveData?.startDate} to {leaveData?.endDate}
            </p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold">Test Subject:</p>
            <p className="text-gray-900">{leaveData?.subject}</p>
          </div>
          <div>
            <p className="text-gray-500 font-semibold">Submission Date:</p>
            <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      {/* Detailed Test Results */}
      <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
        <h3 className="text-xl font-bold text-gray-900">Test Performance Breakdown</h3>
        
        {/* MCQ Results */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Multiple Choice Questions</span>
            <span className="font-bold text-blue-600">{mcqPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all ${
                parseInt(mcqPercentage) >= 70 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${mcqPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            Correct Answers: {mcqScore} out of {totalMcq}
          </p>
        </div>

        {/* Coding Test Results */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700">Coding Challenge</span>
            <span className={`font-bold ${codingScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
              {codingScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className={`h-4 rounded-full transition-all ${
                codingScore >= 70 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${codingScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500">
            Test Cases Passed: {passedTests} out of {totalTests}
          </p>
        </div>

        {/* Combined Score */}
        <div className="space-y-2 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-blue-900">Final Combined Score</span>
            <span className={`font-bold text-xl ${combinedScore >= 70 ? 'text-green-600' : 'text-red-600'}`}>
              {combinedScore}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6">
            <div
              className={`h-6 rounded-full transition-all ${
                combinedScore >= 70 ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${combinedScore}%` }}
            ></div>
          </div>
          <p className="text-xs text-blue-800">
            Calculation: MCQ (60%) + Coding (40%)
          </p>
        </div>

        {/* Pass/Fail Threshold */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-sm text-gray-700 mb-2">
            <strong>Approval Criteria:</strong> Minimum 70% combined score required.
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• MCQ Score: {mcqPercentage}% (Weight: 60%)</li>
            <li>• Coding Score: {codingScore}% (Weight: 40%)</li>
            <li>• <strong>Final Score: {combinedScore}%</strong></li>
          </ul>
          {!isApproved && (
            <p className="text-sm text-red-600 mt-2">
              You scored {combinedScore}%. Please retake the test to improve your score.
            </p>
          )}
        </div>
      </div>

      {/* Next Steps */}
      {isApproved ? (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h4 className="font-semibold text-green-900 mb-2">What's Next?</h4>
          <ul className="space-y-2 text-sm text-green-800">
            <li>✓ Your leave request has been automatically approved</li>
            <li>✓ You will receive a confirmation email shortly</li>
            <li>✓ The leave dates have been marked in the system</li>
            <li>✓ You can view this in your dashboard</li>
          </ul>
        </div>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h4 className="font-semibold text-red-900 mb-2">What's Next?</h4>
          <ul className="space-y-2 text-sm text-red-800">
            <li>• You can reapply and retake the test</li>
            <li>• Review the study materials for {testData?.subject}</li>
            <li>• Contact your administrator for additional support</li>
            <li>• Try applying with a different subject</li>
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 pt-4">
        <Button onClick={onBackToDashboard} variant="primary" className="px-8">
          Back to Dashboard
        </Button>
        {!isApproved && (
          <Button onClick={onBackToDashboard} variant="secondary" className="px-8">
            Apply Again
          </Button>
        )}
      </div>

      {/* Confetti effect for approved */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TestResults;
