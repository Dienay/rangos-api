import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import BaseError from '../errors/BaseError';
import BadRequest from '../errors/BadRequest';
import ValidateError from '../errors/ValidateError';

// Error handling middleware function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handlesErrors(error: Error, req: Request, res: Response, next: NextFunction) {
  // Handling CastError from Mongoose
  if (error instanceof mongoose.Error.CastError) {
    // Sending a BadRequest response
    new BadRequest().sendResponse(res);
  }
  // Handling ValidationError from Mongoose
  else if (error instanceof mongoose.Error.ValidationError) {
    // Sending a ValidateError response
    new ValidateError(error).sendResponse(res);
  }
  // Handling other custom errors that extend from BaseError
  else if (error instanceof BaseError) {
    // Sending the custom error response
    error.sendResponse(res);
  }
  // Fallback for unhandled errors
  else {
    // Sending a generic BaseError response
    new BaseError().sendResponse(res);
  }
}

export default handlesErrors;
