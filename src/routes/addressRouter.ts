import { Router } from 'express';
import checkToken from '../middlewares/checkToken';
import AddressController from '../controllers/addressController';

export const addressRouter = Router();

const { addAddress, getAddress, editAddress, deleteAddress } = AddressController;

addressRouter.get('/:entityId/address', checkToken, getAddress);
addressRouter.post('/:entityId/address', checkToken, addAddress);
addressRouter.put('/:entityId/address/:addressId', checkToken, editAddress);
addressRouter.delete('/:entityId/address/:addressId', deleteAddress);
