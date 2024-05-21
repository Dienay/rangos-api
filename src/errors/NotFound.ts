import BaseError from './BaseError';

// NotFound extends BaseError and is used for 404 Not Found errors
class NotFound extends BaseError {
  constructor(message = 'Page Not Found') {
    // Calling the superclass constructor with a custom message and status code
    super(message, 404);
  }
}

export default NotFound;
