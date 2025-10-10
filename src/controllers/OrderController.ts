import { NextFunctionProps, RequestProps, ResponseProps } from '../config';
import { Establishment, User } from '../models';
import Order, { IOrder, IProductOrder, OrderStatus } from '../models/Order';

class OrderController {
  static createOrder = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId } = req.params;
      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));

      if (!entity) {
        return res.status(404).json({ message: 'Entity not found.' });
      }

      if (entity instanceof Establishment) {
        return res.status(403).json({ message: 'Only customer users can create orders.' });
      }

      if (entity instanceof User) {
        const body = req.body as IOrder;
        const newOrder = await Order.create(body);
        await newOrder.save();
        res.status(201).json({ message: 'Order created successfully', order: newOrder });
      }
    } catch (error) {
      next(error);
    }
    return undefined;
  };

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

  static getOrders = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
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
            select: 'name coverPhoto deliveryTime'
          })
          .populate({ path: 'products.productId', select: 'name price coverPhoto' });
      } else if (entity instanceof Establishment) {
        orders = await Order.find({ establishmentId: entityId, status: { $ne: OrderStatus.Cart } })
          .populate({
            path: 'userId',
            select: 'name'
          })
          .populate({ path: 'products.productId', select: 'name price coverPhoto' });
      }

      if (orders.length === 0) {
        return res.status(404).json({ message: 'Orders list empty.', orders: [] });
      }

      return res.status(200).json({ message: 'Orders fetched successfully', orders });
    } catch (error) {
      return next(error);
    }
  };

  static getOrderById = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId, orderId } = req.params;
      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));
      const order = await Order.findById(orderId);

      if (!entity) {
        return res.status(404).json({ message: 'Entity not found.' });
      }

      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      if (entity instanceof Establishment && order.status === OrderStatus.Cart) {
        return res.status(400).json({ message: 'Only costumer user can view order in the cart.' });
      }

      return res.status(200).json({ message: 'Order fetched successfully', order });
    } catch (error) {
      return next(error);
    }
  };

  static updateOrder = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId, orderId } = req.params;
      const updateData = req.body as Partial<IOrder>;
      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      if (!entity) {
        return res.status(404).json({ message: 'Entity not found.' });
      }

      const validTransitions: { [key: string]: string[] } = {
        Cart: ['Ordered'],
        Ordered: ['Received'],
        Received: ['Preparing'],
        Preparing: ['Sent'],
        Sent: ['Delivered'],
        Delivered: [],
        Canceled: []
      };

      if (!validTransitions[order.status].includes(updateData.status!)) {
        return res
          .status(400)
          .json({ message: `Invalid status transition from ${order.status} to ${updateData.status}.` });
      }

      if (entity instanceof User) {
        if (order.status === OrderStatus.Cart && updateData.status === OrderStatus.Ordered) {
          order.status = OrderStatus.Ordered;
          await order.save();
          return res.status(200).json({ message: 'Order sent to the establishment.', order });
        }

        if (order.status === OrderStatus.Sent && updateData.status === OrderStatus.Delivered) {
          order.status = OrderStatus.Delivered;
          await order.save();
          return res.status(200).json({ message: 'Order delivered.', order });
        }

        if (order.status !== OrderStatus.Cart) {
          return res.status(400).json({ message: 'Order cannot be edited.' });
        }
      } else if (entity instanceof Establishment) {
        if (order.status === OrderStatus.Cart) {
          return res.status(400).json({ message: 'Only costumer user can edit order in the cart.' });
        }

        if (order.status === OrderStatus.Ordered && updateData.status === OrderStatus.Received) {
          order.status = OrderStatus.Received;
          await order.save();
          return res.status(200).json({ message: 'Order received.', order });
        }

        if (order.status === OrderStatus.Received && updateData.status === OrderStatus.Preparing) {
          order.status = OrderStatus.Preparing;
          await order.save();
          return res.status(200).json({ message: 'Order preparing.', order });
        }

        if (order.status === OrderStatus.Preparing && updateData.status === OrderStatus.Sent) {
          order.status = OrderStatus.Sent;
          await order.save();
          return res.status(200).json({ message: 'Order sent.', order });
        }

        if (order.status === OrderStatus.Sent) {
          return res.status(400).json({ message: 'Waiting user confirm order.' });
        }
      }

      const updatedOrder = await Order.findByIdAndUpdate(orderId, updateData, { new: true });

      if (!updatedOrder) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      return res.status(200).json({ message: 'Order updated successfully' });
    } catch (error) {
      return next(error);
    }
  };

  static deleteOrder = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId, orderId } = req.params;
      const order = await Order.findById(orderId);
      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));

      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      if (!entity) {
        return res.status(404).json({ message: 'Entity not found.' });
      }

      if (entity instanceof Establishment) {
        return res.status(400).json({ message: 'Only costumer user can delete order.' });
      }

      if (order.status !== OrderStatus.Cart) {
        return res.status(404).json({ message: 'You can`t delete this order.' });
      }

      const deletedOrder = await Order.findByIdAndDelete(orderId);
      if (!deletedOrder) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      return res.status(200).json({ message: 'Order deleted successfully', order: deletedOrder });
    } catch (error) {
      return next(error);
    }
  };

  static addProduct = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId, orderId } = req.params;
      const product = req.body as IProductOrder;
      const order = await Order.findById(orderId);
      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));

      if (!entity) {
        return res.status(404).json({ message: 'Entity not found.' });
      }

      if (entity instanceof Establishment) {
        return res.status(400).json({ message: 'Only costumer user can add product.' });
      }

      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      if (order.status !== OrderStatus.Cart) {
        return res.status(404).json({ message: 'This order is no longer in the cart.' });
      }

      order.products.push({
        quantity: product.quantity,
        productId: product.productId
      });

      await order.save();

      return res.status(200).json({
        message: 'Product added successfully',
        product
      });
    } catch (error) {
      return next(error);
    }
  };

  static deleteProduct = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { entityId, orderId, productId } = req.params;
      const order = await Order.findById(orderId);
      const entity = (await User.findById(entityId)) || (await Establishment.findById(entityId));

      if (!entity) {
        return res.status(404).json({ message: 'Entity not found.' });
      }

      if (entity instanceof Establishment) {
        return res.status(400).json({ message: 'Only costumer user can delete product.' });
      }

      if (!order) {
        return res.status(404).json({ message: 'Order not found.' });
      }

      const productIndex = order.products.findIndex((product) => product.productId.toString() === productId);

      if (productIndex === -1) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      order.products.splice(productIndex, 1);
      await order.save();

      return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      return next(error);
    }
  };
}

export default OrderController;
