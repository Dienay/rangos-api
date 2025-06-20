import { Router } from 'express';
import OrderController from '../controllers/OrderController';

export const orderRouter = Router();

const { createOrder, getOrders, updateOrder, deleteOrder, getOrderById, addProduct, deleteProduct } = OrderController;

orderRouter.put('/:entityId/orders/:orderId/products', addProduct);
orderRouter.delete('/:entityId/orders/:orderId/products/:productId', deleteProduct);
orderRouter.post('/:entityId/orders', createOrder);
orderRouter.get('/:entityId/orders', getOrders);
orderRouter.get('/:entityId/orders/:orderId', getOrderById);
orderRouter.put('/:entityId/orders/:orderId', updateOrder);
orderRouter.delete('/:entityId/orders/:orderId', deleteOrder);
