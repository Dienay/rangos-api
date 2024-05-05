import express, { Router, Request, Response } from "express";
import { userRouter } from "./userRouter";

const routes = (app: Router) => {
  app.route("/").get((req: Request, res: Response) => {
    res.status(200).json({ message: "Nova Rota principal"});
  });

  app.use(express.json(), userRouter);
};

export default routes;