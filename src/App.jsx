import { useState } from 'react';
import Navbar from './components/layout/Navbar';
import RoleSelect from './pages/auth/RoleSelect';
import StudentDashboard from './pages/student/StudentDashboard';
import ApplyLeave from './pages/student/ApplyLeave';
import TestEnvironment from './pages/student/TestEnvironment';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  const [userRole, setUserRole] = useState(null); // 'student' | 'admin' | null
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard' | 'applyLeave' | 'test'
  const [testData, setTestData] = useState(null); // Data for test environment

  const handleSelectRole = (role) => {
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage('dashboard');
    setTestData(null);
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
    // In production: send to backend
    setCurrentPage('dashboard');
  };

  // Show role selection if no user role selected
  if (!userRole) {
    return <RoleSelect onSelectRole={handleSelectRole} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={userRole} onLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {userRole === 'student' && (
          <>
            {currentPage === 'dashboard' && (
              <StudentDashboard onApplyLeave={handleApplyLeave} />
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
          </>
        )}

        {userRole === 'admin' && currentPage === 'dashboard' && (
          <AdminDashboard />
        )}
      </main>
    </div>
  );
}

export default App;
