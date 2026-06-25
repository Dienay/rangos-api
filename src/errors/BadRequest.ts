import BaseError from './BaseError';

class BadRequest extends BaseError {
  constructor(message = 'Bad Request') {
    super(message, 400);
  }
}

export default BadRequest;
