import { Router } from 'express';
import EstablishmentController from '@/controllers/establishmentController';
import { establishmentsUpload } from '@/config/multer';

// Creating a new router instance
export const establishmentRouter = Router();

// Destructuring methods from EstablishmentController
const { createEstablishment, getEstablishments, getEstablishmentById, updateEstablishment, deleteEstablishment } =
  EstablishmentController;

// Defining routes for establishments
establishmentRouter.post('/establishments', establishmentsUpload.single('coverPhoto'), createEstablishment);
establishmentRouter.get('/establishments', getEstablishments);
establishmentRouter.get('/establishments/:id', getEstablishmentById);
establishmentRouter.put('/establishments/:id', updateEstablishment);
establishmentRouter.delete('/establishments/:id', deleteEstablishment);
