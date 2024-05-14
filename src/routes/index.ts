import express, { Router, Request, Response } from "express";
import { userRouter } from "./userRouter";
import { productsRouter } from "./productRouter";

const routes = (app: Router) => {
  app.route("/").get((req: Request, res: Response) => {
    res.status(200).json({ message: "Nova Rota principal"});
  });

  app.use(express.json(), userRouter);
  app.use(
    express.json(),
    productsRouter
  );
};

export default routes;