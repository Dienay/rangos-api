import { Router } from 'express';
import OrderController from '../controllers/OrderController';

export const orderRouter = Router();

const { createOrder, getOrdersByEntity, getAllOrders, updateOrder, deleteOrder, getOrderById } = OrderController;

orderRouter.post('/:entityId/orders', createOrder);
orderRouter.get('/orders', getAllOrders);
orderRouter.get('/:entityId/orders', getOrdersByEntity);
orderRouter.get('/:entityId/orders/:orderId', getOrderById);
orderRouter.put('/:entityId/orders/:orderId', updateOrder);
orderRouter.delete('/:entityId/orders/:orderId', deleteOrder);
