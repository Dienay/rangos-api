import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import BaseError from '../errors/BaseError';
import BadRequest from '../errors/BadRequest';
import NotFound from '../errors/NotFound';
import ValidateError from '../errors/ValidateError';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function handlesErrors(erro: Error, req: Request, res: Response, next: NextFunction) {
  if (erro instanceof mongoose.Error.CastError) {
    new BadRequest().sendResponse(res);
  } else if (erro instanceof mongoose.Error.ValidationError) {
    new ValidateError(erro).sendResponse(res);
  } else if (erro instanceof NotFound) {
    erro.sendResponse(res);
  } else if (erro instanceof BaseError) {
    erro.sendResponse(res);
  } else {
    new BaseError().sendResponse(res);
  }
}

export default handlesErrors;
