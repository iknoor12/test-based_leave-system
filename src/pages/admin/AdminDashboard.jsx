import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AdminDashboard = () => {
  const stats = [
    { title: 'Total Students', value: '450', description: 'Registered in system' },
    { title: 'Pending Requests', value: '23', description: 'Awaiting approval' },
    { title: 'Approved Requests', value: '189', description: 'This month' },
    { title: 'Failed Tests', value: '12', description: 'Unable to validate' },
  ];

  const pendingRequests = [
    { id: 1, studentName: 'Aman Singh', reason: 'Medical', testScore: '85%', status: 'Pending' },
    { id: 2, studentName: 'Priya Sharma', reason: 'Family', testScore: '92%', status: 'Pending' },
    { id: 3, studentName: 'Raj Kumar', reason: 'Personal', testScore: '78%', status: 'Pending' },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>

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

      {/* Pending Requests Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Pending Leave Requests</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reason</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Test Score</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pendingRequests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{req.studentName}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{req.reason}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-green-600">{req.testScore}</td>
                  <td className="px-6 py-4 text-sm space-x-2 flex">
                    <Button variant="success" className="px-3 py-1 text-xs">
                      Approve
                    </Button>
                    <Button variant="danger" className="px-3 py-1 text-xs">
                      Reject
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">✓ 12 leaves approved today</p>
            <p className="text-sm text-gray-600">✓ 3 tests awaiting grading</p>
            <p className="text-sm text-gray-600">✓ System running smoothly</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Button className="w-full" variant="primary">
              View All Requests
            </Button>
            <Button className="w-full" variant="secondary">
              Generate Report
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
