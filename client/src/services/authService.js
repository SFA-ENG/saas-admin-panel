import { httpClient } from './httpClient';
import errorHandler from '../utils/errorHandler.jsx';

// Token keys for localStorage
const TOKEN_KEY = 'sfa_admin_token';
const USER_KEY = 'sfa_admin_user';

// Mock user data for demo purposes (will be removed once server is implemented)
const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@sfa.com',
    password: 'Password@123', // In a real app, never store plaintext passwords
    accessType: 'admin', // This is crucial for role-based access
    role: 'admin', // Additional role field for backward compatibility
    permissions: [
      'VIEW_DASHBOARD',
      'VIEW_TOURNAMENTS',
      'VIEW_MATCHES',
      'VIEW_ACADEMY',
      'VIEW_SFA_NEXT',
      'VIEW_SPORTS_CAMPS',
      'VIEW_MODULES',
      'VIEW_USER_MANAGEMENT',
      'VIEW_USERS',
      'MANAGE_USERS',
      'VIEW_ROLES',
      'MANAGE_ROLES',
      'ASSIGN_ROLES',
      'VIEW_SETTINGS',
    ],
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
];

/**
 * Auth service class for handling authentication operations
 */
class AuthService {
  /**
   * Login with email and password
   * @param {Object} credentials - User credentials (email, password)
   * @returns {Promise} Promise object with user data and token
   */
  async login(credentials) {
    try {
      // When API is ready, use this:
      // const response = await httpClient.post('/login', credentials);
      // const { data } = response;
      // const { access_token, meta } = data;
      // const { user } = meta;
      // this.setSession(access_token, user);
      // return { user: this.sanitizeUser(user), token: access_token };
      // // Create a mock token
      // const token = `mock-jwt-token-${Math.random().toString(36).substring(2)}`;
      // // Store auth data
      // this.setSession(token, user);
      // // Log user data for debugging
      // console.log('User logged in with data:', this.sanitizeUser(user));
      // return { user: this.sanitizeUser(user), token };
    } catch (error) {
      errorHandler.handleError(error);
      throw error;
    }
  }

  /**
   * Register a new user
   * @param {Object} userData - User registration data
   * @returns {Promise} Promise object with user data and token
   */
  async register(userData) {
    try {
      // When API is ready, use this:
      // const response = await httpClient.post('/auth/register', userData);
      // const { user, token } = response;

      // For now, use the mock implementation
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Check if email already exists
      const existingUser = MOCK_USERS.find((u) => u.email === userData.email);
      if (existingUser) {
        throw { status: 409, message: 'Email already in use' };
      }

      // Create a new user
      const newUser = {
        id: MOCK_USERS.length + 1,
        name: userData.name,
        email: userData.email,
        password: userData.password,
        accessType: 'user',
        permissions: [
          'VIEW_DASHBOARD',
          'VIEW_TOURNAMENTS',
          'VIEW_MATCHES',
          'VIEW_ACADEMY',
          'VIEW_SFA_NEXT',
          'VIEW_SPORTS_CAMPS',
          'VIEW_SETTINGS',
        ],
        avatar: `https://randomuser.me/api/portraits/${
          Math.random() > 0.5 ? 'men' : 'women'
        }/${Math.floor(Math.random() * 100)}.jpg`,
      };

      // Add to mock database (in memory only for this demo)
      MOCK_USERS.push(newUser);

      // Create a mock token
      const token = `mock-jwt-token-${Math.random().toString(36).substring(2)}`;

      // Store auth data
      this.setSession(token, newUser);

      return { user: this.sanitizeUser(newUser), token };
    } catch (error) {
      errorHandler.handleError(error);
      throw error;
    }
  }

  /**
   * Logout the current user
   * @returns {Promise} Promise that resolves when logout is complete
   */
  async logout() {
    try {
      // When API is ready, use this:
      // await httpClient.post('/auth/logout');

      // Clear session
      this.clearSession();

      return true;
    } catch (error) {
      // Still clear session even if API call fails
      this.clearSession();

      // Log the error but don't throw (we want to ensure logout happens)
      console.error('Logout error:', error);
      return true;
    }
  }

  /**
   * Get the current logged in user
   * @returns {Object|null} User object or null if not logged in
   */
  getCurrentUser() {
    const userJson = localStorage.getItem(USER_KEY);
    if (!userJson) return null;

    try {
      return JSON.parse(userJson);
    } catch (e) {
      this.clearSession();
      return null;
    }
  }

  /**
   * Check if the user is authenticated
   * @returns {boolean} True if user is authenticated, false otherwise
   */
  isAuthenticated() {
    return !!localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Get the authentication token from storage
   * @returns {string|null} Token or null if not found
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  /**
   * Request password reset email
   * @param {Object} data - Object containing the email address
   * @returns {Promise} Promise that resolves when request is complete
   */
  async requestPasswordReset(data) {
    try {
      // When API is ready, use this:
      // return await httpClient.post('/auth/reset-password-request', data);

      // For now, simulate success
      return {
        success: true,
        message: 'Password reset link sent to your email.',
      };
    } catch (error) {
      errorHandler.handleError(error);
      throw error;
    }
  }

  /**
   * Reset password with token (from email link)
   * @param {Object} data - Object containing token and new password
   * @returns {Promise} Promise that resolves when password is reset
   */
  async resetPassword(data) {
    try {
      // When API is ready, use this:
      // return await httpClient.post('/auth/reset-password', data);

      // For now, simulate success
      return {
        success: true,
        message: 'Password has been reset successfully.',
      };
    } catch (error) {
      errorHandler.handleError(error);
      throw error;
    }
  }

  // Private methods

  /**
   * Store authentication data
   * @param {string} token - Authentication token
   * @param {Object} user - User object
   * @private
   */
  setSession(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(this.sanitizeUser(user)));
  }

  /**
   * Clear authentication data from storage
   * @private
   */
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  /**
   * Remove sensitive information from user object
   * @param {Object} user - User object with sensitive data
   * @returns {Object} Sanitized user object
   * @private
   */
  sanitizeUser(user) {
    const userToStore = { ...user };
    delete userToStore.password;

    // For admin@sfa.com, ensure accessType is always properly set
    if (userToStore.email === 'admin@sfa.com') {
      userToStore.accessType = 'admin';
      userToStore.role = 'admin';
    }

    return userToStore;
  }
}

// Create and export a singleton instance
const authService = new AuthService();
export default authService;

// For backward compatibility with existing code
export const login = (credentials) => authService.login(credentials);
export const register = (userData) => authService.register(userData);
export const logout = () => authService.logout();
export const getCurrentUser = () => authService.getCurrentUser();
export const isAuthenticated = () => authService.isAuthenticated();
export const setSession = (token, user) => authService.setSession(token, user);
export const sanitizeUser = (user) => authService.sanitizeUser(user);
