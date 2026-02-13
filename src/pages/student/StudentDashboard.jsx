import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const StudentDashboard = ({ onApplyLeave, leaveHistory = [], userName }) => {
  // Calculate dynamic stats based on leave history
  const approvedLeaves = leaveHistory.filter(leave => leave.status === 'Approved');
  const pendingLeaves = leaveHistory.filter(leave => leave.status === 'Pending');
  const rejectedLeaves = leaveHistory.filter(leave => leave.status === 'Rejected');
  
  const totalLeaveDays = 40;
  const usedDays = approvedLeaves.length * 2; // Assuming 2 days per leave
  const remainingDays = totalLeaveDays - usedDays;
  
  const stats = [
    { title: 'Total Leave Days', value: totalLeaveDays.toString(), description: 'Available for this year' },
    { title: 'Used Days', value: usedDays.toString(), description: 'Already taken' },
    { title: 'Remaining Days', value: remainingDays.toString(), description: 'Left to use' },
    { title: 'Total Requests', value: leaveHistory.length.toString(), description: 'All submissions' },
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Leave Application History</h2>
        
        {leaveHistory.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No leave applications yet</p>
            <Button onClick={onApplyLeave} variant="primary">
              Apply for Your First Leave
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {leaveHistory.map((leave) => (
              <div 
                key={leave.id} 
                className="flex flex-col md:flex-row md:justify-between md:items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{leave.reason}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {leave.startDate} to {leave.endDate} • {leave.subject}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-600">
                    <span>📊 MCQ: {leave.mcqScore} ({leave.mcqPercentage})</span>
                    <span>💻 Coding: {leave.codingScore}</span>
                    <span>🎯 Final: {leave.combinedScore}</span>
                    <span>📅 {leave.submittedDate}</span>
                  </div>
                </div>
                <div className="mt-3 md:mt-0 flex items-center gap-2">
                  <span 
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      leave.status === 'Approved' 
                        ? 'bg-green-100 text-green-700' 
                        : leave.status === 'Rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {leave.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statistics Summary */}
      {leaveHistory.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card
            title="Approved Leaves"
            value={approvedLeaves.length.toString()}
            description="Successfully granted"
            className="border-green-300"
          />
          <Card
            title="Rejected Leaves"
            value={rejectedLeaves.length.toString()}
            description="Did not meet criteria"
            className="border-red-300"
          />
          <Card
            title="Average Score"
            value={
              leaveHistory.length > 0
                ? `${Math.round(
                    leaveHistory.reduce((sum, leave) => {
                      const percentage = parseInt(leave.combinedScore);
                      return sum + percentage;
                    }, 0) / leaveHistory.length
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
