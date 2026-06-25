import BaseError from './BaseError';

class ConflictError extends BaseError {
  constructor(message = 'Conflict') {
    super(message, 409);
  }
}
export default ConflictError;
