// Import the required modules from 'express' and middleware libraries
import express, { Router, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

// Define types for Router, Request, Response, and NextFunction
type RouterProps = Router;
type RequestProps = Request;
type ResponseProps = Response;
type NextFunctionProps = NextFunction;

// Create an Express application instance
const app = express();

// Apply middleware to enhance security, performance, and handling of JSON and URL-encoded data

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors());
// Enhance HTTP headers for better security
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
// Compress HTTP responses
app.use(compression({ level: 9 }));
// Parse incoming JSON payloads
app.use(express.json());
// Parse incoming URL-encoded payloads
app.use(express.urlencoded({ extended: true }));

export { app, RouterProps, RequestProps, ResponseProps, NextFunctionProps };
