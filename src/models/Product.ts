import mongoose, { Schema, Types, Model } from 'mongoose';

export interface IProduct {
  productImage?: string;
  thumbnail?: string;
  name: string;
  description?: string;
  price: number;
  establishmentId: Types.ObjectId;
}

export interface TopProduct {
  _id: string;
  name: string;
  price: number;
  productImage: string;
  totalSales: number;
}

export const productSchema = new Schema<IProduct>(
  {
    productImage: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true },
    establishmentId: {
      type: Schema.Types.ObjectId,
      ref: 'establishment',
      required: true
    }
  },
  {
    versionKey: false
  }
);

const Product: Model<IProduct> = mongoose.model<IProduct>('product', productSchema);

export default Product;
