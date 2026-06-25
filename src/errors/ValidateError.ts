import { Error as MongooseError } from 'mongoose';
import BaseError from './BaseError';

class ValidateError extends BaseError {
  constructor(error: MongooseError.ValidationError) {
    const message = Object.values(error.errors)
      .map((err) => err.message)
      .join('; ');

    super(message, 422);
  }
}

export default ValidateError;
