import axios from 'axios';

/**
 * HttpClient - A generic HTTP client based on Axios
 * Provides helper methods for common HTTP operations with interceptors for
 * global error handling, authentication, and request/response transformations.
 */
class HttpClient {
  /**
   * Create a new HttpClient instance
   * @param {Object} config - Configuration for the axios instance
   */
  constructor(config = {}) {
    // Create new axios instance with default config
    this.client = axios.create({
      baseURL: 'http://localhost:3000/api/v1/iam',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...config,
    });

    console.log(this.client);

    // Initialize request interceptors
    this.initRequestInterceptors();

    // Initialize response interceptors
    this.initResponseInterceptors();
  }

  /**
   * Initialize request interceptors
   */
  initRequestInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        // Get the token from localStorage (if exists)
        const token = localStorage.getItem('auth_token');

        // If token exists, add it to the headers
        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }

        // Log the request (dev only)
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `📤 [API Request] ${config.method.toUpperCase()} ${config.baseURL}${
              config.url
            }`,
            config.data || {}
          );
        }

        return config;
      },
      (error) => {
        // Handle request error
        console.error('📤 [API Request Error]', error);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Initialize response interceptors
   */
  initResponseInterceptors() {
    this.client.interceptors.response.use(
      (response) => {
        // Log the response (dev only)
        if (process.env.NODE_ENV === 'development') {
          console.log(
            `📥 [API Response] ${response.status} ${response.config.url}`,
            response.data
          );
        }

        // Return just the data by default
        return response.data;
      },
      (error) => {
        // Handle response error
        console.error('📥 [API Response Error]', error);

        // Handle unauthorized errors (401)
        if (error.response && error.response.status === 401) {
          // Clear auth token and redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/auth';
        }

        let errorMessage = '';

        error.response?.data?.errors?.forEach((error) => {
          error.rawErrors?.forEach((rawError) => {
            errorMessage += rawError.message + '\n';
          });
        });

        // Format the error for easier handling
        const formattedError = {
          status: error.response?.status,
          statusText: error.response?.statusText,
          message: errorMessage || error.message,
          data: error.response?.data,
        };

        console.log(formattedError);

        return Promise.reject(formattedError);
      }
    );
  }

  /**
   * Make a GET request
   * @param {string} url - API endpoint
   * @param {Object} params - URL parameters
   * @param {Object} config - Additional axios config
   * @returns {Promise} Promise object representing the request
   */
  get(url, params = {}, config = {}) {
    return this.client.get(url, { params, ...config });
  }

  /**
   * Make a POST request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} config - Additional axios config
   * @returns {Promise} Promise object representing the request
   */
  post(url, data = {}, config = {}) {
    return this.client.post(url, data, config);
  }

  /**
   * Make a PUT request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} config - Additional axios config
   * @returns {Promise} Promise object representing the request
   */
  put(url, data = {}, config = {}) {
    return this.client.put(url, data, config);
  }

  /**
   * Make a PATCH request
   * @param {string} url - API endpoint
   * @param {Object} data - Request body
   * @param {Object} config - Additional axios config
   * @returns {Promise} Promise object representing the request
   */
  patch(url, data = {}, config = {}) {
    return this.client.patch(url, data, config);
  }

  /**
   * Make a DELETE request
   * @param {string} url - API endpoint
   * @param {Object} config - Additional axios config
   * @returns {Promise} Promise object representing the request
   */
  delete(url, config = {}) {
    return this.client.delete(url, config);
  }

  /**
   * Upload a file
   * @param {string} url - API endpoint
   * @param {FormData} formData - Form data containing the file
   * @param {Object} config - Additional axios config
   * @returns {Promise} Promise object representing the request
   */
  upload(url, formData, config = {}) {
    return this.client.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      ...config,
    });
  }

  /**
   * Download a file
   * @param {string} url - API endpoint
   * @param {Object} params - URL parameters
   * @param {Object} config - Additional axios config
   * @returns {Promise} Promise object representing the request
   */
  download(url, params = {}, config = {}) {
    return this.client.get(url, {
      params,
      responseType: 'blob',
      ...config,
    });
  }

  /**
   * Make requests in parallel
   * @param {Array} requests - Array of request functions that return promises
   * @returns {Promise} Promise that resolves when all requests are complete
   */
  all(requests) {
    return Promise.all(requests);
  }
}

// Export a singleton instance with default config
export const httpClient = new HttpClient();

// Also export the class for creating custom instances
export default HttpClient;
