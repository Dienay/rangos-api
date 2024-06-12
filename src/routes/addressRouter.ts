import { Router } from 'express';
import checkToken from '@/middlewares/checkToken';
import AddressController from '@/controllers/addressController';

// Create a new router instance
export const addressRouter = Router();

// Destructure the required methods from UserController
const { addAddress, getAddress, editAddress, deleteAddress } = AddressController;
// Define routes
// Define routes protected by the checkToken middleware
addressRouter.get('/:entityId/address', checkToken, getAddress);
addressRouter.post('/:entityId/address', checkToken, addAddress);
addressRouter.put('/:entityId/address/:addressId', checkToken, editAddress);
addressRouter.delete('/:entityId/address/:addressId', deleteAddress);
