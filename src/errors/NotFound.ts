import BaseError from './BaseError';

class NotFound extends BaseError {
  constructor(message = 'Resource Not Found') {
    super(message, 404);
  }
}

export default NotFound;
