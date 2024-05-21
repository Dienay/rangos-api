import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

interface IProduct extends Document {
// Define the IProduct interface extending mongoose.Document, representing a product structure
  id: mongoose.Types.ObjectId;
  coverPhoto: string;
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
    name: { type: String, require: true },
    description: { type: String },
    price: { type: Number, require: true },
    establishment: {
      type: mongoose.Schema.Types.ObjectId,
      // Reference to the 'establishment' model in MongoDB
      ref: 'establishment',
      // Enable autopopulate to automatically populate the establishment field
      autopopulate: true
    }
  },
  {
    // Remove the version key (__v) from the documents
    versionKey: false
  }
);

// Apply the autopopulate plugin to the schema, enabling automatic population of referenced fields
productSchema.plugin(autopopulate);

// Create the Product model using the defined schema and IProduct interface
const Product = mongoose.model<IProduct>('product', productSchema);

export default Product;
export { IProduct };
