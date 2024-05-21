import { Response } from 'express';

// BaseError extends Error and provides a structured way to handle errors
class BaseError extends Error {
  // Property to store HTTP status code
  status: number;

  // Constructor to initialize the error message and status code
  constructor(message: string = 'Internal Server Error', status = 500) {
    // Calling the superclass constructor with the error message
    super(message);
    // Assigning the HTTP status code
    this.status = status;
  }

  // Method to send a JSON response with the error details
  sendResponse(res: Response) {
    res.status(this.status).json({
      // Sending the error message
      message: this.message,
      // Sending the HTTP status code
      status: this.status
    });
  }
}

export default BaseError;
