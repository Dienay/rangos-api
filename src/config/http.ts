import express, { NextFunction, Request, Response, Router } from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';

type RequestProps = Request;
type ResponseProps = Response;
type NextFunctionProps = NextFunction;
type RouterProps = Router;

const app = express();
app.use(cors());
app.use(helmet());
app.use(compression({ level: 9 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

export { app, RouterProps, RequestProps, ResponseProps, NextFunctionProps };
