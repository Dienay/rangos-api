import { Router } from "express";
import EstablishmentController from "../controllers/establishmentController";

export const establishmentRouter = Router();

const createEstablishment = EstablishmentController.createEstablishment;
const getEstablishments = EstablishmentController.getEstablishments;
const getEstablishmentById = EstablishmentController.getEstablishmentById;
const updateEstablishments = EstablishmentController.updateEstablishment;
const deleteEstablishment = EstablishmentController.deleteEstablishment;

establishmentRouter.post("/establishments", createEstablishment);
establishmentRouter.get("/establishments", getEstablishments);
establishmentRouter.get("/establishments/:id", getEstablishmentById);
establishmentRouter.put("/establishments/:id", updateEstablishments);
establishmentRouter.delete("/establishments/:id", deleteEstablishment);
