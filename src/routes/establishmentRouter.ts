import { Router } from 'express';
import EstablishmentController from '../controllers/establishmentController';
import { establishmentsUpload } from '../config/multer';
import { addressRouter } from './addressRouter';
import { orderRouter } from './orderRouter';

export const establishmentRouter = Router();

const {
  createEstablishment,
  getEstablishments,
  getEstablishmentById,
  getEstablishmentWithProducts,
  updateEstablishment,
  deleteEstablishment,
  filterEstablishment
} = EstablishmentController;

establishmentRouter.post('/establishments', establishmentsUpload.single('logo'), createEstablishment);
establishmentRouter.get('/establishments', getEstablishments);
establishmentRouter.get('/establishments/search', filterEstablishment);
establishmentRouter.get('/establishments/:id/products', getEstablishmentWithProducts);
establishmentRouter.get('/establishments/:id', getEstablishmentById);
establishmentRouter.put('/establishments/:id', establishmentsUpload.single('logo'), updateEstablishment);
establishmentRouter.delete('/establishments/:id', deleteEstablishment);

establishmentRouter.use('/establishments', addressRouter);

establishmentRouter.use('/establishments', orderRouter);
