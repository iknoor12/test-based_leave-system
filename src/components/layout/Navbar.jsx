import Button from '../common/Button';

const Navbar = ({ userRole = 'student', onLogout }) => {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold text-blue-600">
            Test-Based Leave System
          </h1>
          {userRole && (
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-sm font-semibold rounded-full capitalize">
              {userRole}
            </span>
          )}
        </div>

        <Button onClick={onLogout} variant="secondary">
          Logout
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
