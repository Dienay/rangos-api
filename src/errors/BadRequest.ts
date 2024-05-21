import BaseError from './BaseError';

// BadRequest extends BaseError and is used for 400 Bad Request errors
class BadRequest extends BaseError {
  constructor(message = 'Bad Request: incorrect input data') {
    // Calling the superclass constructor with a custom message and status code
    super(message, 400);
  }
}

export default BadRequest;
