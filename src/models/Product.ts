import mongoose from 'mongoose';

// Define the IProduct interface extending mongoose.Document, representing a product structure
interface IProduct extends mongoose.Document {
  id: mongoose.Types.ObjectId;
  coverPhoto?: string;
  name: string;
  description: string;
  price: number;
  establishment: mongoose.Types.ObjectId;
}

// Define the product schema to be used for creating the Mongoose model
const productSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    coverPhoto: { type: String },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    establishment: {
      type: mongoose.Schema.Types.ObjectId,
      // Reference to the 'establishment' model in MongoDB
      ref: 'establishment'
    }
  },
  {
    // Remove the version key (__v) from the documents
    versionKey: false
  }
);

// Create the Product model using the defined schema and IProduct interface
const Product = mongoose.model<IProduct>('product', productSchema);

export default Product;
export { IProduct, productSchema };
