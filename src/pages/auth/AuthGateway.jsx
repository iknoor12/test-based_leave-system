import { useMemo, useState } from 'react';
import Button from '../../components/common/Button';
import { loginUser, registerUser } from '../../services/authApi';

const AuthGateway = ({ onAuthenticate }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'signup'
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminPasskey: '',
  });

  const helperText = useMemo(() => {
    if (authMode === 'signup') {
      return 'Create an account, then continue to the dashboard.';
    }
    return 'Sign in to continue to your dashboard.';
  }, [authMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');

    if (authMode === 'signup' && formState.password !== formState.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (role === 'admin' && !formState.adminPasskey.trim()) {
      setError('Admin passkey is required.');
      return;
    }

    setIsSubmitting(true);

    const action = authMode === 'signup'
      ? registerUser({
          name: formState.name,
          email: formState.email,
          password: formState.password,
          role,
          passkey: formState.adminPasskey,
        })
      : loginUser({
          email: formState.email,
          password: formState.password,
          passkey: formState.adminPasskey,
          role,
        });

    action
      .then((response) => {
        const userPayload = {
          ...response.user,
          token: response.token,
        };
        onAuthenticate(userPayload);
      })
      .catch((err) => {
        setError(err.message || 'Authentication failed.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-lg w-full space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-blue-600">Test-Based Leave System</h1>
          <p className="text-gray-600">{helperText}</p>
        </div>

        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              authMode === 'login'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('signup')}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition ${
              authMode === 'signup'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {authMode === 'signup' && (
            <div>
              <label className="text-sm font-medium text-gray-700">Full name</label>
              <input
                name="name"
                value={formState.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formState.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formState.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {authMode === 'signup' && (
            <div>
              <label className="text-sm font-medium text-gray-700">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formState.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {role === 'admin' && (
            <div>
              <label className="text-sm font-medium text-gray-700">Admin passkey</label>
              <input
                type="password"
                name="adminPasskey"
                value={formState.adminPasskey}
                onChange={handleChange}
                placeholder="Enter admin passkey"
                className="mt-1 w-full border border-gray-200 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Continue as</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`border rounded-lg p-3 text-sm font-semibold transition ${
                  role === 'student'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-blue-300'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`border rounded-lg p-3 text-sm font-semibold transition ${
                  role === 'admin'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 text-gray-600 hover:border-blue-300'
                }`}
              >
                Administrator
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}

          <Button
            variant="primary"
            className="w-full py-3"
            disabled={
              isSubmitting ||
              (authMode === 'signup' && formState.password !== formState.confirmPassword) ||
              (role === 'admin' && !formState.adminPasskey.trim())
            }
          >
            {isSubmitting
              ? authMode === 'signup'
                ? 'Creating...'
                : 'Logging in...'
              : authMode === 'signup'
                ? 'Create account'
                : 'Login'}
          </Button>
        </form>

        <p className="text-xs text-gray-500 text-center">
          Tests are required before approving leave requests.
        </p>
      </div>
    </div>
  );
};

export default AuthGateway;
