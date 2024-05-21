import { Router } from 'express';
import EstablishmentController from '../controllers/establishmentController';

// Creating a new router instance
export const establishmentRouter = Router();

const { createEstablishment } = EstablishmentController;
const { getEstablishments } = EstablishmentController;
const { getEstablishmentById } = EstablishmentController;
const { updateEstablishment } = EstablishmentController;
const { deleteEstablishment } = EstablishmentController;
// Destructuring methods from EstablishmentController

// Defining routes for establishments
establishmentRouter.post('/establishments', createEstablishment);
establishmentRouter.get('/establishments', getEstablishments);
establishmentRouter.get('/establishments/:id', getEstablishmentById);
establishmentRouter.put('/establishments/:id', updateEstablishment);
establishmentRouter.delete('/establishments/:id', deleteEstablishment);
