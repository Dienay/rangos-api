import { Error as MongooseError } from 'mongoose';
import BaseError from './BaseError';

class ValidateError extends BaseError {
  constructor(erro: MongooseError.ValidationError) {
    const errorMessage = Object.values(erro.errors)
      .map((error) => error.message)
      .join('; ');

    super(`Found errors: ${errorMessage}`);
  }
}

export default ValidateError;
