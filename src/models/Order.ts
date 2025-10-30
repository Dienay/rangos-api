import mongoose from 'mongoose';
import { IAddress, addressSchema } from './Address';

/**
 * Order Schema
 * --------------------------------------------------
 * Represents a customer purchase within the Rangos system.
 * Each order links to a user and an establishment, and contains:
 * - Product list
 * - Payment info
 * - Delivery address snapshot
 * - Status tracking
 */

// -----------------------------
// ENUMS AND INTERFACES
// -----------------------------

// Enum for order lifecycle states
export enum OrderStatus {
  Ordered = 'Ordered',
  Paid = 'Paid',
  Preparing = 'Preparing',
  Sent = 'Sent',
  Delivered = 'Delivered',
  Canceled = 'Canceled'
}

// Product structure inside an order
export interface IOrderedProduct {
  productId: mongoose.Types.ObjectId; // Reference to the Product document
  name: string; // Product name (snapshot at purchase time)
  quantity: number; // Number of units purchased
  price: number; // Price per unit (snapshot)
  subtotal: number; // Calculated as quantity * price
}

// Payment details for the order
export interface IPaymentInfo {
  method: string; // Payment method: Pix, CreditCard, etc.
  status: string; // "Paid" or "Pending"
  transactionId: string; // External or internal transaction reference
}

// Main Order interface
export interface IOrder extends mongoose.Document {
  userId: mongoose.Types.ObjectId; // Buyer (User reference)
  establishmentId: mongoose.Types.ObjectId; // Seller (Establishment reference)
  orderNumber: string; // Unique, human-readable order ID
  status: OrderStatus; // Current state of the order
  products: [IOrderedProduct]; // List of purchased items
  shipping: number; // Delivery/shipping cost
  subtotal: number; // Sum of item subtotals
  totalPrice: number; // subtotal + shipping
  deliveryAddress: IAddress; // Delivery address snapshot
  payment: IPaymentInfo; // Payment metadata
  notes?: string; // Optional delivery notes
  createdAt: Date; // Auto-generated timestamp
  updatedAt: Date; // Auto-generated timestamp
}

// -----------------------------
// SCHEMAS
// -----------------------------

// Schema for ordered products (embedded in Order)
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
  { _id: false } // Avoid nested _id inside products array
);

// Schema for payment info (embedded in Order)
const paymentSchema = new mongoose.Schema(
  {
    method: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    transactionId: { type: String, required: true }
  },
  { _id: false } // Avoid nested _id inside payment object
);

const orderSchema = new mongoose.Schema(
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
    timestamps: true, // Automatically generates createdAt and updatedAt
    versionKey: false // Removes the __v version key from documents
  }
);

// -----------------------------
// INDEXES AND EXPORT
// -----------------------------

// Commonly queried fields for optimization

orderSchema.index({ userId: 1 });
orderSchema.index({ establishmentId: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>('order', orderSchema);
export default Order;
