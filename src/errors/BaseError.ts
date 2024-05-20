import { Response } from 'express';

class BaseError extends Error {
  status: number;

  constructor(message: string = 'Internal Server Error', status = 500) {
    super(message);
    this.status = status;
  }

  sendResponse(res: Response) {
    res.status(this.status).json({
      message: this.message,
      status: this.status
    });
  }
}

export default BaseError;
