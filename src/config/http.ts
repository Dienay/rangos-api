// Import the required modules from 'express' and middleware libraries
import express = require('express');
import type { Express } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

// Create an Express application instance
const app = express() as Express;

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

export { app };
