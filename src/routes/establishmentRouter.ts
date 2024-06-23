import { Router } from 'express';
import EstablishmentController from '@/controllers/establishmentController';
import { establishmentsUpload } from '@/config/multer';
import { addressRouter } from './addressRouter';
import { orderRouter } from './OrderRouter';

// Creating a new router instance
export const establishmentRouter = Router();

// Destructuring methods from EstablishmentController
const {
  createEstablishment,
  getEstablishments,
  getEstablishmentById,
  getEstablishmentWithProducts,
  updateEstablishment,
  deleteEstablishment,
} = EstablishmentController;

// Defining routes for establishments
establishmentRouter.post('/establishments', establishmentsUpload.single('coverPhoto'), createEstablishment);
establishmentRouter.get('/establishments', getEstablishments);
establishmentRouter.get('/establishments/:id/products', getEstablishmentWithProducts);
establishmentRouter.get('/establishments/:id', getEstablishmentById);
establishmentRouter.put('/establishments/:id', establishmentsUpload.single('coverPhoto'), updateEstablishment);
establishmentRouter.delete('/establishments/:id', deleteEstablishment);

// Use addressRouter for address-related routes
establishmentRouter.use('/establishments', addressRouter);

establishmentRouter.use('/establishments', orderRouter);
