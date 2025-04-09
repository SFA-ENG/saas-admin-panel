import { message as antdMessage } from 'antd';

/**
 * Error handler utility for API calls
 * Provides consistent error handling throughout the application
 */
class ErrorHandler {
  /**
   * Handle API errors with default behavior
   * @param {Object} error - Error object from API call
   * @param {Function} callback - Optional callback for custom error handling
   * @returns {void}
   */
  handleError(error, callback) {
    // Log error to console
    console.error('API Error:', error);

    // Display appropriate error message based on status code
    if (error.status) {
      switch (error.status) {
        case 400:
          this.showErrorMessage(
            'Invalid Request', 
            error.message || 'The request was invalid. Please check your input.'
          );
          break;
        case 401:
          this.showErrorMessage(
            'Unauthorized', 
            'Your session has expired. Please log in again.'
          );
          break;
        case 403:
          this.showErrorMessage(
            'Forbidden', 
            'You do not have permission to perform this action.'
          );
          break;
        case 404:
          this.showErrorMessage(
            'Not Found', 
            error.message || 'The requested resource was not found.'
          );
          break;
        case 422:
          this.showErrorMessage(
            'Validation Error', 
            error.message || 'Please check your input and try again.'
          );
          break;
        case 500:
        case 502:
        case 503:
        case 504:
          this.showErrorMessage(
            'Server Error', 
            'There was a problem with the server. Please try again later.'
          );
          break;
        default:
          this.showErrorMessage(
            'Error', 
            error.message || 'An unexpected error occurred.'
          );
      }
    } else {
      // Network error or other non-HTTP error
      this.showErrorMessage(
        'Connection Error', 
        error.message || 'Could not connect to the server. Please check your internet connection.'
      );
    }

    // Execute callback if provided
    if (callback && typeof callback === 'function') {
      callback(error);
    }
  }

  /**
   * Show error message with Ant Design message component
   * @param {string} title - Error title
   * @param {string} message - Error message
   * @returns {void}
   */
  showErrorMessage(title, message) {
    antdMessage.error({
      content: (
        <div>
          <strong>{title}</strong>
          <p>{message}</p>
        </div>
      ),
      duration: 5,
    });
  }

  /**
   * Format validation errors from API response
   * @param {Object} errors - Validation errors object
   * @returns {Object} Formatted errors for form display
   */
  formatValidationErrors(errors) {
    const formattedErrors = {};
    
    if (errors && typeof errors === 'object') {
      Object.keys(errors).forEach(field => {
        formattedErrors[field] = {
          validateStatus: 'error',
          help: Array.isArray(errors[field]) ? errors[field][0] : errors[field],
        };
      });
    }
    
    return formattedErrors;
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Export default for flexibility
export default errorHandler;