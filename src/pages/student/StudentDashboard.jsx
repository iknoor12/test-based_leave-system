import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const StudentDashboard = ({ onApplyLeave }) => {
  const stats = [
    { title: 'Total Leave Days', value: '20', description: 'Available for this year' },
    { title: 'Used Days', value: '5', description: 'Already taken' },
    { title: 'Remaining Days', value: '15', description: 'Left to use' },
    { title: 'Pending Requests', value: '1', description: 'Awaiting approval' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Leave Requests</h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-semibold text-gray-900">Medical Emergency</p>
              <p className="text-sm text-gray-500">Jan 5-6, 2026</p>
            </div>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
              Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
