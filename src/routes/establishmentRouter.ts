import { Router } from 'express';
import EstablishmentController from '../controllers/establishmentController';

export const establishmentRouter = Router();

const { createEstablishment } = EstablishmentController;
const { getEstablishments } = EstablishmentController;
const { getEstablishmentById } = EstablishmentController;
const updateEstablishments = EstablishmentController.updateEstablishment;
const { deleteEstablishment } = EstablishmentController;

establishmentRouter.post('/establishments', createEstablishment);
establishmentRouter.get('/establishments', getEstablishments);
establishmentRouter.get('/establishments/:id', getEstablishmentById);
establishmentRouter.put('/establishments/:id', updateEstablishments);
establishmentRouter.delete('/establishments/:id', deleteEstablishment);
