import { httpClient } from './httpClient';

/**
 * API Service - Handles specific API endpoints
 * Using the generic HTTP client for actual requests
 */
class ApiService {
  /**
   * User API endpoints
   */
  users = {
    /**
     * Get all users
     * @param {Object} params - Query parameters for filtering/pagination
     * @returns {Promise} Promise object representing the request
     */
    getAll: (params = {}) => httpClient.get('/users', params),

    /**
     * Get user by ID
     * @param {number|string} id - User ID
     * @returns {Promise} Promise object representing the request
     */
    getById: (id) => httpClient.get(`/users/${id}`),

    /**
     * Create a new user
     * @param {FormData} userData - User data to create including profile picture
     * @returns {Promise} Promise object representing the request
     */
    create: (userData) => httpClient.post('/users', userData, {
      headers: {
        'accept': '*/*',
        'x-channel-id': 'WEB',
        // Don't set Content-Type here, it will be automatically set with boundary for FormData
        'Authorization': `Bearer ${localStorage.getItem('sfa_admin_token') || ''}`
      }
    }),

    /**
     * Update a user
     * @param {number|string} id - User ID
     * @param {FormData} userData - User data to update including profile picture
     * @returns {Promise} Promise object representing the request
     */
    update: (id, userData) => httpClient.patch(`/users`, userData),

    /**
     * Delete a user
     * @param {number|string} id - User ID
     * @returns {Promise} Promise object representing the request
     */
    delete: (id) => httpClient.delete(`/users/${id}`)
  };

  /**
   * Role API endpoints
   */
  roles = {
    /**
     * Get all roles
     * @param {Object} params - Query parameters for filtering/pagination
     * @returns {Promise} Promise object representing the request
     */
    getAll: (params = {}) => httpClient.get('/roles', params, {
      headers: {
        'accept': '*/*',
        'x-channel-id': 'WEB'
      }
    }),

    /**
     * Update role permissions
     * @param {Object} data - Role permissions data
     * @param {string} data.tenant_role_id - Role ID
     * @param {string[]} data.tenant_privilege_ids - Array of privilege IDs
     * @param {string} data.type - Type of update (e.g., 'ADD' or 'REMOVE')
     * @returns {Promise} Promise object representing the request
     */
    updatePermissions: (data) => httpClient.patch('/roles/role-permissions', data, {
      headers: {
        'accept': '*/*',
        'x-channel-id': 'WEB',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('sfa_admin_token') || ''}`
      }
    }),

    /**
     * Get role permissions
     * @returns {Promise} Promise object representing the request
     */
    getPermissions: () => httpClient.get('/roles/role-permissions'),

    /**
     * Get role by ID
     * @param {number|string} id - Role ID
     * @returns {Promise} Promise object representing the request
     */
    getById: (id) => httpClient.get(`/roles/${id}`, {
      headers: {
        'x-channel-id': 'WEB'
      }
    }),

    /**
     * Create a new role
     * @param {Object} roleData - Role data to create
     * @returns {Promise} Promise object representing the request
     */
    create: (roleData) => httpClient.post('/roles', roleData),

    /**
     * Update a role
     * @param {number|string} id - Role ID
     * @param {Object} roleData - Role data to update
     * @returns {Promise} Promise object representing the request
     */
    // update: (roleData) => httpClient.patch(`/roles-permissions`, roleData),

    /**
     * Delete a role
     * @param {number|string} id - Role ID
     * @returns {Promise} Promise object representing the request
     */
    delete: (id) => httpClient.delete(`/roles/${id}`),
  }
  /**
   * User-Role mapping API endpoints
   */
  userRoles = {
    /**
     * Get all user-role mappings
     * @param {Object} params - Query parameters for filtering/pagination
     * @returns {Promise} Promise object representing the request
     */
    getAll: (params = {}) => httpClient.get('/user-roles', params),

    /**
     * Assign roles to a user
     * @param {Object} mappingData - Mapping data with tenant_user_id and tenant_role_ids
     * @returns {Promise} Promise object representing the request
     */
    assign: (mappingData) => httpClient.patch('/users/user-role', mappingData),

    /**
     * Update a user-role mapping
     * @param {number|string} id - Mapping ID
     * @param {Object} mappingData - Mapping data to update
     * @returns {Promise} Promise object representing the request
     */
    update: (id, mappingData) =>
      httpClient.put(`/user-roles/${id}`, mappingData),

    /**
     * Delete a user-role mapping
     * @param {number|string} id - Mapping ID
     * @returns {Promise} Promise object representing the request
     */
    delete: (id) => httpClient.delete(`/user-roles/${id}`),
  };

  /**
   * Tournament API endpoints
   */
  tournaments = {
    /**
     * Get all tournaments
     * @param {Object} params - Query parameters for filtering/pagination
     * @returns {Promise} Promise object representing the request
     */
    getAll: (params = {}) => httpClient.get('/tournaments', params),

    /**
     * Get tournament by ID
     * @param {number|string} id - Tournament ID
     * @returns {Promise} Promise object representing the request
     */
    getById: (id) => httpClient.get(`/tournaments/${id}`),

    /**
     * Create a new tournament
     * @param {Object} tournamentData - Tournament data to create
     * @returns {Promise} Promise object representing the request
     */
    create: (tournamentData) => httpClient.post('/tournaments', tournamentData),

    /**
     * Update a tournament
     * @param {number|string} id - Tournament ID
     * @param {Object} tournamentData - Tournament data to update
     * @returns {Promise} Promise object representing the request
     */
    update: (id, tournamentData) =>
      httpClient.put(`/tournaments/${id}`, tournamentData),

    /**
     * Delete a tournament
     * @param {number|string} id - Tournament ID
     * @returns {Promise} Promise object representing the request
     */
    delete: (id) => httpClient.delete(`/tournaments/${id}`),
  };

  /**
   * Match API endpoints
   */
  matches = {
    /**
     * Get all matches
     * @param {Object} params - Query parameters for filtering/pagination
     * @returns {Promise} Promise object representing the request
     */
    getAll: (params = {}) => httpClient.get('/matches', params),

    /**
     * Get match by ID
     * @param {number|string} id - Match ID
     * @returns {Promise} Promise object representing the request
     */
    getById: (id) => httpClient.get(`/matches/${id}`),

    /**
     * Create a new match
     * @param {Object} matchData - Match data to create
     * @returns {Promise} Promise object representing the request
     */
    create: (matchData) => httpClient.post('/matches', matchData),

    /**
     * Update a match
     * @param {number|string} id - Match ID
     * @param {Object} matchData - Match data to update
     * @returns {Promise} Promise object representing the request
     */
    update: (id, matchData) => httpClient.put(`/matches/${id}`, matchData),

    /**
     * Delete a match
     * @param {number|string} id - Match ID
     * @returns {Promise} Promise object representing the request
     */
    delete: (id) => httpClient.delete(`/matches/${id}`),
  };

  /**
   * Dashboard API endpoints
   */
  dashboard = {
    /**
     * Get dashboard statistics
     * @returns {Promise} Promise object representing the request
     */
    getStats: () => httpClient.get('/dashboard/stats'),

    /**
     * Get recent activities
     * @param {Object} params - Query parameters for filtering/pagination
     * @returns {Promise} Promise object representing the request
     */
    getActivities: (params = {}) =>
      httpClient.get('/dashboard/activities', params),
  };

  /**
   * Authentication API endpoints
   */
  auth = {
    /**
     * Login with username/email and password
     * @param {Object} credentials - Login credentials
     * @returns {Promise} Promise object representing the request
     */
    login: (credentials) => httpClient.post('/login', credentials),

    /**
     * Register a new user
     * @param {Object} userData - User registration data
     * @returns {Promise} Promise object representing the request
     */
    register: (userData) => httpClient.post('/auth/register', userData),

    /**
     * Register a new tenant
     * @param {Object} tenantData - Tenant registration data
     * @returns {Promise} Promise object representing the request
     */
    registerTenant: (tenantData) => httpClient.post('/onboard-tenant', tenantData),

    /**
     * Logout the current user
     * @returns {Promise} Promise object representing the request
     */
    logout: () => httpClient.post('/logout'),

    /**
     * Get the current user's profile
     * @returns {Promise} Promise object representing the request
     */
    getCurrentUser: () => httpClient.get('/auth/me'),

    /**
     * Reset password request (sends email)
     * @param {Object} data - Email data for password reset
     * @returns {Promise} Promise object representing the request
     */
    resetPasswordRequest: (data) =>
      httpClient.post('/auth/reset-password-request', data),

    /**
     * Reset password with token
     * @param {Object} data - Password reset data with token
     * @returns {Promise} Promise object representing the request
     */
    resetPassword: (data) => httpClient.post('/auth/reset-password', data),
  };

  /**
   * Privilege API endpoints
   */
  privileges = {
    /**
     * Get all privileges
     * @param {Object} params - Query parameters for filtering/pagination
     * @returns {Promise} Promise object representing the request
     */
    getAll: (params = {}) => httpClient.get('/privileges', params, {
      headers: {
        'accept': '*/*',
        'x-channel-id': 'WEB',
        'Authorization': `Bearer ${localStorage.getItem('sfa_admin_token') || ''}`
      }
    }),

    /**
     * Get privilege by ID
     * @param {string} id - Privilege UUID
     * @returns {Promise} Promise object representing the request
     */
    getById: (id) => httpClient.get(`/privileges/${id}`, {
      headers: {
        'accept': '*/*',
        'x-channel-id': 'WEB',
        'Authorization': `Bearer ${localStorage.getItem('sfa_admin_token') || ''}`
      }
    }),
  };
}

// Export singleton instance
export const apiService = new ApiService();

// Export default for flexibility
export default apiService;
