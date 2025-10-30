import { NextFunctionProps, RequestProps, ResponseProps } from '../config';
import { Establishment, User } from '../models';
import { Order, IOrder, OrderStatus } from '../models/Order';

/**
 * OrderController
 * --------------------------------------------------
 * Handles all order-related operations:
 * - Create, list, update, and delete orders
 * - Add/remove products in cart-like workflows
 * - Manage order status transitions
 */
class OrderController {
  /**
   * Create a new order
   * Only users (customers) can create orders, not establishments
   */
  static createOrder = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId } = req.params;
      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));

      if (!entity) return res.status(404).json({ message: 'Entity not found.' });

      if (entity instanceof Establishment)
        return res.status(403).json({ message: 'Only customer users can create orders.' });

      const body = req.body as IOrder;

      // Ensure totals are correct
      const subtotal = body.products.reduce((acc, product) => acc + product.price * product.quantity, 0);

      const totalPrice = subtotal + (body.shipping ?? 0);

      const newOrder = await Order.create({
        ...body,
        subtotal,
        totalPrice
      });

      await newOrder.save();
      return res.status(201).json({ message: 'Order created successfully', order: newOrder });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Get all orders (for admin/debug purposes)
   */
  static getAllOrders = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const orders = await Order.find({});

      if (orders.length === 0) {
        return res.status(404).json({ message: 'Orders list empty.', orders: [] });
      }
      return res.status(200).json({ message: 'Orders fetched successfully', orders });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Get all orders related to a specific user or establishment
   */
  static getOrdersByEntity = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId } = req.params;
      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));
      let orders: IOrder[] = [];

      if (!entity) {
        return res.status(404).json({ message: 'Entity not found.' });
      }

      if (entity instanceof User) {
        orders = await Order.find({ userId: entityId })
          .populate({
            path: 'establishmentId',
            select: 'name logo'
          })
          .populate({ path: 'products.productId', select: 'name price productImage' });
      } else if (entity instanceof Establishment) {
        orders = await Order.find({ establishmentId: entityId })
          .populate({
            path: 'userId',
            select: 'name email'
          })
          .populate({
            path: 'products.productId',
            select: 'name price productImage'
          });
      }

      if (orders.length === 0) {
        return res.status(404).json({ message: 'Orders list empty.', orders: [] });
      }

      return res.status(200).json({ message: 'Orders fetched successfully', orders });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Retrieve a single order by its ID
   */
  static getOrderById = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId, orderId } = req.params;
      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));

      if (!entity) {
        return res.status(404).json({ message: 'Entity not found.' });
      }

      const order = await Order.findById(orderId)
        .populate({
          path: 'userId',
          select: 'name email'
        })
        .populate({
          path: 'establishmentId',
          select: 'name logo'
        })
        .populate({
          path: 'products.productId',
          select: 'name price productImage'
        });

      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      return res.status(200).json({ message: 'Order fetched successfully', order });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Update order status or details
   */
  static updateOrder = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId, orderId } = req.params;
      const updateData = req.body as Partial<IOrder>;
      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));

      if (!entity) {
        return res.status(404).json({ message: 'Entity not found.' });
      }

      const order = await Order.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      const validTransitions: Record<OrderStatus, OrderStatus[]> = {
        Ordered: [OrderStatus.Paid, OrderStatus.Canceled],
        Paid: [OrderStatus.Preparing, OrderStatus.Canceled],
        Preparing: [OrderStatus.Sent, OrderStatus.Canceled],
        Sent: [OrderStatus.Delivered],
        Delivered: [],
        Canceled: []
      };

      if (updateData.status && !validTransitions[order.status].includes(updateData.status)) {
        return res
          .status(400)
          .json({ message: `Invalid status transition from ${order.status} to ${updateData.status}.` });
      }

      // Apply updates
      Object.assign(order, updateData);
      await order.save();

      return res.status(200).json({ message: 'Order updated successfully', order });
    } catch (error) {
      return next(error);
    }
  };

  /**
   * Delete an order (only users can delete their pending orders)
   */
  static deleteOrder = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId, orderId } = req.params;
      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));
      if (!entity) return res.status(404).json({ message: 'Entity not found.' });

      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ message: 'Order not found.' });

      if (entity instanceof Establishment)
        return res.status(400).json({ message: 'Only costumer user can delete order.' });

      if (![OrderStatus.Ordered, OrderStatus.Paid].includes(order.status))
        return res.status(400).json({ message: 'You can`t delete this order.' });

      await Order.findByIdAndDelete(orderId);
      return res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
      return next(error);
    }
  };
}

export default OrderController;
