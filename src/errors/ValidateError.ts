import { Error as MongooseError } from 'mongoose';
import BaseError from './BaseError';

// ValidateError extends BaseError and is used for Mongoose validation errors
class ValidateError extends BaseError {
  constructor(error: MongooseError.ValidationError) {
    // Extracting error messages from Mongoose's ValidationError
    const errorMessage = Object.values(error.errors)
      .map((err) => err.message)
      .join('; ');

    // Calling the superclass constructor with a formatted error message
    super(`Found errors: ${errorMessage}`);
  }
}

export default ValidateError;
