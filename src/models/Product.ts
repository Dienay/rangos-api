import mongoose, { Schema, Types, Model } from 'mongoose';

// Define the IProduct interface extending mongoose.Document, representing a product structure
export interface IProduct {
  productImage?: string;
  thumbnail?: string;
  name: string;
  description?: string;
  price: number;
  establishment: Types.ObjectId;
}

export interface TopProduct {
  _id: string;
  name: string;
  price: number;
  productImage: string;
  totalSales: number;
}

// Define the product schema to be used for creating the Mongoose model
export const productSchema = new Schema<IProduct>(
  {
    productImage: { type: String },
    thumbnail: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    establishment: {
      type: Schema.Types.ObjectId,
      // Reference to the 'establishment' model in MongoDB
      ref: 'establishment',
      required: true
    }
  },
  {
    // Remove the version key (__v) from the documents
    versionKey: false
  }
);

// Create the Product model using the defined schema and IProduct interface
const Product: Model<IProduct> = mongoose.model<IProduct>('product', productSchema);

export default Product;
