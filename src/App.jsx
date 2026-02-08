import { useEffect, useState } from 'react';
import Navbar from './components/layout/Navbar';
import AuthGateway from './pages/auth/AuthGateway';
import StudentDashboard from './pages/student/StudentDashboard';
import ApplyLeave from './pages/student/ApplyLeave';
import TestEnvironment from './pages/student/TestEnvironment';
import TestResults from './pages/student/TestResults';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const [authUser, setAuthUser] = useState(null); // { role, name, email, token }
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' | 'applyLeave' | 'test' | 'results'
  const [testData, setTestData] = useState(null); // Data for test environment
  const [testResults, setTestResults] = useState(null); // Test results data
  const [leaveHistory, setLeaveHistory] = useState([]); // Store all leave applications

  useEffect(() => {
    const storedAuth = localStorage.getItem('authUser');
    if (storedAuth) {
      setAuthUser(JSON.parse(storedAuth));
    }
  }, []);

  const handleAuthenticate = (user) => {
    setAuthUser(user);
    localStorage.setItem('authUser', JSON.stringify(user));
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setAuthUser(null);
    localStorage.removeItem('authUser');
    setCurrentPage('dashboard');
    setTestData(null);
    setTestResults(null);
    setLeaveHistory([]);
  };

  const handleApplyLeave = () => {
    setCurrentPage('applyLeave');
  };

  const handleBackToDashboard = () => {
    setCurrentPage('dashboard');
  };

  const handleProceedToTest = (formData) => {
    setTestData(formData);
    setCurrentPage('test');
  };

  const handleTestComplete = (results) => {
    console.log('Test Results:', results);
    
    // Calculate MCQ score
    const mcqScore = results?.mcqResults?.score || 0;
    const totalMcq = results?.mcqResults?.totalQuestions || 5;
    const mcqPercentage = ((mcqScore / totalMcq) * 100).toFixed(0);
    
    // Get coding score
    const codingScore = results?.codingResults?.codingScore || 0;
    
    // Calculate combined score (60% MCQ + 40% Coding)
    const combinedScore = Math.round(parseInt(mcqPercentage) * 0.6 + codingScore * 0.4);
    
    // Approval requires 70% combined score
    const isApproved = combinedScore >= 70;
    
    // Create leave application record
    const leaveApplication = {
      id: Date.now(),
      reason: testData.reason,
      startDate: testData.startDate,
      endDate: testData.endDate,
      subject: testData.subject,
      mcqScore: `${mcqScore}/${totalMcq}`,
      mcqPercentage: `${mcqPercentage}%`,
      codingScore: `${codingScore}%`,
      combinedScore: `${combinedScore}%`,
      status: isApproved ? 'Approved' : 'Rejected',
      submittedDate: new Date().toLocaleDateString(),
      testResults: results,
    };
    
    // Add to history
    setLeaveHistory([leaveApplication, ...leaveHistory]);
    
    // Store test results and show results page
    setTestResults(results);
    setCurrentPage('results');
  };

  // Show role selection if no user role selected
  if (!authUser) {
    return <AuthGateway onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={authUser.role} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {authUser.role === 'student' && (
          <>
            {currentPage === 'dashboard' && (
              <StudentDashboard 
                onApplyLeave={handleApplyLeave}
                leaveHistory={leaveHistory}
              />
            )}
            {currentPage === 'applyLeave' && (
              <ApplyLeave
                onSubmit={handleProceedToTest}
                onBack={handleBackToDashboard}
              />
            )}
            {currentPage === 'test' && testData && (
              <TestEnvironment
                subject={testData.subject}
                onTestComplete={handleTestComplete}
                onBack={handleBackToDashboard}
              />
            )}
            {currentPage === 'results' && testResults && (
              <TestResults
                testData={testResults}
                leaveData={testData}
                onBackToDashboard={handleBackToDashboard}
              />
            )}
          </>
        )}

        {authUser.role === 'admin' && currentPage === 'dashboard' && (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}

export default App;
