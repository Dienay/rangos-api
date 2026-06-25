import express = require('express');
import type { Express } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

const app = express() as Express;

app.use(cors());
app.use(
  helmet({
    crossOriginResourcePolicy: false
  })
);
app.use(compression({ level: 9 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export { app };
