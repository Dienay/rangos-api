import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { BaseError, BadRequest, ValidateError } from '../errors';

function handlesErrors(error: Error, _req: Request, res: Response, _next: NextFunction) {
  if (error instanceof mongoose.Error.CastError) {
    return new BadRequest('Invalid ID format').sendResponse(res);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    return new ValidateError(error).sendResponse(res);
  }

  if (error instanceof BaseError) {
    return error.sendResponse(res);
  }
  return new BaseError().sendResponse(res);
}

export default handlesErrors;
