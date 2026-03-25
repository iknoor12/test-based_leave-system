import { useEffect, useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { getTestResults } from '../../services/authApi';

const StudentDashboard = ({ onApplyLeave, leaveHistory = [], userName }) => {
  const [testHistory, setTestHistory] = useState([]);
  const [loadingResults, setLoadingResults] = useState(true);

  useEffect(() => {
    fetchTestResults();
  }, []);

  const fetchTestResults = async () => {
    try {
      setLoadingResults(true);
      
      // Get current user from localStorage
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      if (!user || !user._id) {
        console.error('User not found');
        setTestHistory([]);
        return;
      }
      
      const results = await getTestResults(user._id);
      
      // Transform backend results to match format
      const formattedResults = results.map((result) => ({
        id: result._id,
        subject: result.subject,
        mcqScore: `${result.mcqResults?.score || 0}/${result.mcqResults?.totalQuestions || 5}`,
        mcqPercentage: `${result.mcqPercentage || 0}%`,
        codingScore: `${result.codingResults?.score || 0}%`,
        combinedScore: `${result.overallScore || 0}%`,
        status: result.status === 'pending' ? 'Pending' : result.status === 'approved' ? 'Approved' : 'Rejected',
        submittedDate: new Date(result.createdAt).toLocaleDateString(),
        reason: `-`,
        startDate: `-`,
        endDate: `-`,
      }));
      
      setTestHistory(formattedResults);
    } catch (error) {
      console.error('Error fetching test results:', error);
      setTestHistory([]);
    } finally {
      setLoadingResults(false);
    }
  };
  // Calculate dynamic stats based on test history
  const approvedTests = testHistory.filter(test => test.status === 'Approved');
  const pendingTests = testHistory.filter(test => test.status === 'Pending');
  const rejectedTests = testHistory.filter(test => test.status === 'Rejected');
  
  const totalLeaveDays = 40;
  const usedDays = approvedTests.length * 2; // Assuming 2 days per leave
  const remainingDays = totalLeaveDays - usedDays;
  
  const stats = [
    { title: 'Total Leave Days', value: totalLeaveDays.toString(), description: 'Available for this year' },
    { title: 'Used Days', value: usedDays.toString(), description: 'Already taken' },
    { title: 'Remaining Days', value: remainingDays.toString(), description: 'Left to use' },
    { title: 'Test Results', value: testHistory.length.toString(), description: 'All test submissions' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          {userName && <p className="text-lg text-gray-600 mt-1">Welcome, {userName}</p>}
        </div>
        <Button onClick={onApplyLeave} variant="primary">
          Apply for Leave
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <Card
            key={idx}
            title={stat.title}
            value={stat.value}
            description={stat.description}
          />
        ))}
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Test Results History</h2>
        
        {loadingResults ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading test results...</p>
          </div>
        ) : testHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No test submissions yet</p>
            <Button onClick={onApplyLeave} variant="primary">
              Take Your First Test
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {testHistory.map((test) => (
              <div 
                key={test.id} 
                className="flex flex-col md:flex-row md:justify-between md:items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Subject: {test.subject}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-600">
                    <span>📊 MCQ: {test.mcqScore} ({test.mcqPercentage})</span>
                    <span>💻 Coding: {test.codingScore}</span>
                    <span>🎯 Overall: {test.combinedScore}</span>
                    <span>📅 {test.submittedDate}</span>
                  </div>
                </div>
                <div className="mt-3 md:mt-0 flex items-center gap-2">
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      test.status === 'Approved' 
                        ? 'bg-green-100 text-green-700' 
                        : test.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {test.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      {testHistory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Approved Tests"
            value={approvedTests.length.toString()}
            description="Leave approved"
            className="border-green-300"
          />
          <Card
            title="Rejected Tests"
            value={rejectedTests.length.toString()}
            description="Did not meet criteria"
            className="border-red-300"
          />
          <Card
            title="Average Score"
            value={
              testHistory.length > 0
                ? `${Math.round(
                    testHistory.reduce((sum, test) => {
                      const score = parseInt(test.combinedScore);
                      return sum + score;
                    }, 0) / testHistory.length
                  )}%`
                : '0%'
            }
            description="Test performance"
            className="border-blue-300"
          />
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
