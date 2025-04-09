import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

const DebugInfo = () => {
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    // Get user data directly from localStorage
    const userKey = 'sfa_admin_user';
    const userJson = localStorage.getItem(userKey);
    if (userJson) {
      try {
        setUserData(JSON.parse(userJson));
      } catch (e) {
        console.error('Error parsing user data:', e);
      }
    }
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-lg mt-4">
      <h3 className="text-lg font-semibold mb-2">Debug Information</h3>
      <div className="bg-white p-3 rounded shadow overflow-auto max-h-40">
        <pre className="text-xs">{JSON.stringify(userData, null, 2)}</pre>
      </div>
    </div>
  );
};

const AuthPage = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('admin@sfa.com');
  const [password, setPassword] = useState('Password@123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await login({ email, password });
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left column - Auth form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600">Sports Admin</h1>
            <p className="text-gray-600">Login to your account</p>
          </div>

          {user ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-center mb-4">
                <h2 className="text-xl font-semibold text-green-600">Successfully Logged In!</h2>
                <p className="text-gray-600 mt-2">You are now logged in as {user.name}</p>
              </div>
              <div className="mt-4 flex flex-col space-y-3">
                <Link 
                  to="/" 
                  className="inline-block bg-blue-600 text-white py-2 px-4 rounded text-center hover:bg-blue-700 transition"
                >
                  Go to Dashboard
                </Link>
              </div>
              
              <DebugInfo />
            </div>
          ) : (
            <form onSubmit={handleLogin} className="bg-white p-6 rounded-lg shadow-md">
              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
              
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-2 px-4 rounded text-white ${
                  loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } transition`}
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
              
              <div className="text-center mt-4 text-sm text-gray-600">
                <p>Demo credentials (pre-filled):</p>
                <p>Email: admin@sfa.com</p>
                <p>Password: Password@123</p>
              </div>
            </form>
          )}
        </div>
      </div>
      
      {/* Right column - Hero */}
      <div className="hidden md:block md:w-1/2 bg-blue-600 text-white">
        <div className="flex flex-col justify-center h-full p-12">
          <h2 className="text-4xl font-bold mb-6">Sports Administration Platform</h2>
          <p className="text-xl mb-8">
            Comprehensive sports management solution for federations, leagues, and organizations.
          </p>
          <ul className="space-y-4 text-lg">
            <li className="flex items-center">
              <span className="mr-3 text-blue-300">✓</span>
              Tournament &amp; match management
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-blue-300">✓</span>
              Team and player statistics
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-blue-300">✓</span>
              Role-based access control
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-blue-300">✓</span>
              Advanced analytics and reporting
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;