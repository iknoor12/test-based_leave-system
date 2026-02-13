import { useState } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const AdminDashboard = ({ userName }) => {
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'allRequests' | 'report'
  const [requests, setRequests] = useState([
    { id: 1, studentName: 'Aman Singh', reason: 'Medical', testScore: '85%', status: 'Pending', subject: 'Mathematics', dateApplied: '2024-01-15' },
    { id: 2, studentName: 'Priya Sharma', reason: 'Family', testScore: '92%', status: 'Pending', subject: 'Physics', dateApplied: '2024-01-16' },
    { id: 3, studentName: 'Raj Kumar', reason: 'Personal', testScore: '78%', status: 'Pending', subject: 'Chemistry', dateApplied: '2024-01-17' },
    { id: 4, studentName: 'Zara Khan', reason: 'Medical', testScore: '88%', status: 'Approved', subject: 'Mathematics', dateApplied: '2024-01-14' },
    { id: 5, studentName: 'John Doe', reason: 'Family', testScore: '65%', status: 'Rejected', subject: 'Physics', dateApplied: '2024-01-13' },
  ]);
  const [generatedReport, setGeneratedReport] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);

  const handleApprove = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'Approved' } : req
    ));
  };

  const handleReject = (id) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: 'Rejected' } : req
    ));
  };

  const handleChangeStatus = (id, newStatus) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: newStatus } : req
    ));
  };

  const handleGenerateReport = () => {
    const totalRequests = requests.length;
    const approved = requests.filter(r => r.status === 'Approved').length;
    const rejected = requests.filter(r => r.status === 'Rejected').length;
    const pending = requests.filter(r => r.status === 'Pending').length;
    const avgScore = (
      requests.reduce((sum, r) => sum + parseInt(r.testScore), 0) / requests.length
    ).toFixed(1);

    setReportDetails({
      totalRequests,
      approved,
      rejected,
      pending,
      avgScore,
      generatedDate: new Date().toLocaleDateString(),
      generatedTime: new Date().toLocaleTimeString(),
    });
    setGeneratedReport(true);
    setCurrentView('report');
  };

  const pendingRequests = requests.filter(req => req.status === 'Pending');
  const passedTestApplicants = requests.filter(req => req.status === 'Approved');
  const stats = [
    { title: 'Total Requests', value: requests.length.toString(), description: 'All applications' },
    { title: 'Pending Requests', value: pendingRequests.length.toString(), description: 'Awaiting approval' },
    { title: 'Approved Requests', value: requests.filter(r => r.status === 'Approved').length.toString(), description: 'Approved' },
    { title: 'Rejected Requests', value: requests.filter(r => r.status === 'Rejected').length.toString(), description: 'Rejected' },
  ];

  // Dashboard View
  if (currentView === 'dashboard') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          {userName && <p className="text-lg text-gray-600 mt-1">Welcome, {userName}</p>}
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

        {/* Pending Requests Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Pending Leave Requests ({pendingRequests.length})</h2>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No pending requests at this moment</p>
            </div>
          ) : (
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
                        <Button 
                          onClick={() => handleApprove(req.id)}
                          variant="success" 
                          className="px-3 py-1 text-xs"
                        >
                          Approve
                        </Button>
                        <Button 
                          onClick={() => handleReject(req.id)}
                          variant="danger" 
                          className="px-3 py-1 text-xs"
                        >
                          Reject
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Passed Test Applicants */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Passed Test & Applied ({passedTestApplicants.length})</h2>
          </div>

          {passedTestApplicants.length === 0 ? (
            <div className="p-6 text-center">
              <p className="text-gray-500">No approved applicants yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reason</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Subject</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Test Score</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Applied Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {passedTestApplicants.map((req) => (
                    <tr key={req.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{req.studentName}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{req.reason}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{req.subject}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">{req.testScore}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{req.dateApplied}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">✓ {requests.filter(r => r.status === 'Approved').length} leaves approved</p>
              <p className="text-sm text-gray-600">✓ {pendingRequests.length} tests awaiting approval</p>
              <p className="text-sm text-gray-600">✓ System running smoothly</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button 
                onClick={() => setCurrentView('allRequests')}
                className="w-full" 
                variant="primary"
              >
                View All Requests
              </Button>
              <Button 
                onClick={handleGenerateReport}
                className="w-full" 
                variant="secondary"
              >
                Generate Report
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // All Requests View
  if (currentView === 'allRequests') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">All Leave Requests</h1>
          <Button 
            onClick={() => setCurrentView('dashboard')}
            variant="secondary"
          >
            Back to Dashboard
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reason</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Test Score</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Applied Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">{req.studentName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{req.reason}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{req.subject}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">{req.testScore}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{req.dateApplied}</td>
                    <td className="px-6 py-4 text-sm space-x-2 flex flex-wrap gap-2">
                      {req.status === 'Pending' ? (
                        <>
                          <Button 
                            onClick={() => handleApprove(req.id)}
                            variant="success" 
                            className="px-3 py-1 text-xs"
                          >
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleReject(req.id)}
                            variant="danger" 
                            className="px-3 py-1 text-xs"
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button 
                            onClick={() => handleChangeStatus(req.id, 'Pending')}
                            variant="secondary" 
                            className="px-2 py-1 text-xs"
                            title="Revert to Pending"
                          >
                            Revert to Pending
                          </Button>
                          {req.status === 'Approved' && (
                            <Button 
                              onClick={() => handleChangeStatus(req.id, 'Rejected')}
                              variant="danger" 
                              className="px-2 py-1 text-xs"
                              title="Change to Rejected"
                            >
                              Change to Rejected
                            </Button>
                          )}
                          {req.status === 'Rejected' && (
                            <Button 
                              onClick={() => handleChangeStatus(req.id, 'Approved')}
                              variant="success" 
                              className="px-2 py-1 text-xs"
                              title="Change to Approved"
                            >
                              Change to Approved
                            </Button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // Report View
  if (currentView === 'report') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Leave Requests Report</h1>
          <Button 
            onClick={() => {
              setCurrentView('dashboard');
              setGeneratedReport(null);
            }}
            variant="secondary"
          >
            Back to Dashboard
          </Button>
        </div>

        {reportDetails && (
          <div className="space-y-6">
            {/* Report Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Report Generated</h2>
              <p className="text-sm text-gray-600">
                Generated on {reportDetails.generatedDate} at {reportDetails.generatedTime}
              </p>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card
                title="Total Requests"
                value={reportDetails.totalRequests.toString()}
                description="All applications"
              />
              <Card
                title="Approved"
                value={reportDetails.approved.toString()}
                description="Successful applications"
              />
              <Card
                title="Rejected"
                value={reportDetails.rejected.toString()}
                description="Failed applications"
              />
              <Card
                title="Pending"
                value={reportDetails.pending.toString()}
                description="Awaiting approval"
              />
            </div>

            {/* Performance */}
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Performance Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">Approval Rate</span>
                    <span className="font-bold text-green-600">
                      {reportDetails.totalRequests > 0 
                        ? ((reportDetails.approved / reportDetails.totalRequests) * 100).toFixed(1) 
                        : 0}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full"
                      style={{ 
                        width: reportDetails.totalRequests > 0 
                          ? ((reportDetails.approved / reportDetails.totalRequests) * 100) 
                          : 0 + '%'
                      }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-gray-700">Average Test Score</span>
                    <span className="font-bold text-blue-600">{reportDetails.avgScore}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-blue-500 h-4 rounded-full"
                      style={{ width: `${reportDetails.avgScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Request Summary Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Request Summary</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Student Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Reason</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Test Score</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {requests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-900">{req.studentName}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{req.reason}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-green-600">{req.testScore}</td>
                        <td className="px-6 py-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            req.status === 'Approved' ? 'bg-green-100 text-green-800' :
                            req.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Export Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <Button 
                onClick={() => alert('Report exported to PDF (feature coming soon)')}
                className="w-full"
                variant="primary"
              >
                Export Report as PDF
              </Button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default AdminDashboard;
