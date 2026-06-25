import mongoose, { HydratedDocument, Model } from 'mongoose';
import { IAddress, addressSchema } from './Address';

export enum OrderStatus {
  Ordered = 'Ordered',
  Paid = 'Paid',
  Preparing = 'Preparing',
  Sent = 'Sent',
  Delivered = 'Delivered',
  Canceled = 'Canceled'
}

export interface IOrderedProduct {
  productId: mongoose.Types.ObjectId;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IPaymentInfo {
  method: string;
  status: string;
  transactionId: string;
}

export interface IOrder {
  userId: mongoose.Types.ObjectId;
  establishmentId: mongoose.Types.ObjectId;
  orderNumber: string;
  status: OrderStatus;
  products: IOrderedProduct[];
  shipping: number;
  subtotal: number;
  totalPrice: number;
  deliveryAddress: IAddress;
  payment: IPaymentInfo;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderDocument = HydratedDocument<IOrder>;

const orderedProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
      required: true
    },
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
    subtotal: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    transactionId: { type: String, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema<IOrder>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
    establishmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'establishment',
      required: true
    },
    orderNumber: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: {
        values: Object.values(OrderStatus),
        message: `( {VALUE} ) is not a valid order status. Allowed statuses are: ${Object.values(OrderStatus).join(', ')}`
      },
      default: OrderStatus.Ordered
    },
    products: { type: [orderedProductSchema], required: true },
    shipping: { type: Number, required: true },
    subtotal: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    deliveryAddress: { type: addressSchema, required: true },
    payment: { type: paymentSchema, required: true },
    notes: { type: String }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

orderSchema.index({ userId: 1 });
orderSchema.index({ establishmentId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

const Order: Model<IOrder> = mongoose.model<IOrder>('order', orderSchema);
export default Order;
