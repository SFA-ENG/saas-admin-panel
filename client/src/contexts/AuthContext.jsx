import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import apiService from '../services/apiService';
import errorHandler from '../utils/errorHandler';

// Create the context
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize the auth state
  useEffect(() => {
    const checkAuthStatus = () => {
      if (authService.isAuthenticated()) {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      const response = await apiService.auth.login(credentials);
      const { data } = response;
      const { access_token, meta } = data;
      const isSuperAdmin = meta.roles?.find(
        (role) => role.role_name?.toUpperCase() === 'SUPER_ADMIN'
      );
      if (!isSuperAdmin) {
        throw {
          status: 403,
          message: 'You are not authorized to access this application',
        };
      }

      authService.setSession(access_token, meta);
      const result = {
        user: authService.sanitizeUser(meta),
        token: access_token,
      };

      // Ensure admin user has proper accessType
      if (!result.user.accessType) {
        result.user.accessType = 'admin';
        console.log('Added admin accessType in AuthContext:', result.user);
      }

      setUser(result.user);
      return result;
    } catch (error) {
      errorHandler.handleError(error);
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      const result = await authService.register(userData);
      setUser(result.user);
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setUser(null);
    navigate('/auth');
  };

  // Context value
  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: () => !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export AuthContext but not as default
// This makes it compatible with hot refresh
export { AuthContext };
