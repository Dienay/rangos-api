import BaseError from './BaseError';

class UnprocessableError extends BaseError {
  constructor(message = 'Unprocessable Entity') {
    super(message, 422);
  }
}
export default UnprocessableError;
