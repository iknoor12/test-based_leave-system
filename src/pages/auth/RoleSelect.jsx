import Button from '../../components/common/Button';

const RoleSelect = ({ onSelectRole }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-12 max-w-md w-full text-center space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-blue-600 mb-2">Test-Based</h1>
          <h2 className="text-4xl font-bold text-blue-600 mb-4">Leave System</h2>
          <p className="text-gray-600">Select your role to continue</p>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => onSelectRole('student')}
            variant="primary"
            className="w-full py-3 text-lg"
          >
            Student
          </Button>

          <Button
            onClick={() => onSelectRole('admin')}
            variant="secondary"
            className="w-full py-3 text-lg"
          >
            Administrator
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          This system requires you to take a test before approving leave requests.
        </p>
      </div>
    </div>
  );
};

export default RoleSelect;
