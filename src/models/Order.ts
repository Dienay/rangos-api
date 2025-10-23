import mongoose from 'mongoose';
import { IAddress, addressSchema } from './Address';

export enum OrderStatus {
  Cart = 'Cart',
  Ordered = 'Ordered',
  Received = 'Received',
  Preparing = 'Preparing',
  Sent = 'Sent',
  Delivered = 'Delivered',
  Canceled = 'Canceled'
}

interface IProductOrder {
  quantity: number;
  productId: mongoose.Types.ObjectId;
}

interface IOrder extends mongoose.Document {
  id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  date: Date;
  status: OrderStatus;
  paymentMethod: string;
  products: [IProductOrder];
  deliveryAddress: IAddress;
  shipping: number;
  totalPrice: number;
}

const orderSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user'
    },
    establishmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'establishment'
    },
    date: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: {
        values: Object.values(OrderStatus),
        message: `( {VALUE} ) is not a valid order status. Allowed statuses are: ${Object.values(OrderStatus).join(', ')}`
      }
    },
    paymentMethod: { type: String },
    products: [
      {
        quantity: { type: Number },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'product'
        },
        _id: false
      }
    ],
    deliveryAddress: addressSchema,
    shipping: { type: Number },
    totalPrice: { type: Number }
  },
  {
    // Remove the version key (__v) from the documents
    versionKey: false
  }
);

const Order = mongoose.model<IOrder>('order', orderSchema);

export default Order;
export { IOrder, IProductOrder };
