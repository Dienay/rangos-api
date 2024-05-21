import mongoose from 'mongoose';
import autopopulate from 'mongoose-autopopulate';

interface IProduct extends Document {
  id: mongoose.Types.ObjectId;
  coverPhoto: string;
  name: string;
  description: string;
  price: number;
  establishment: mongoose.Types.ObjectId;
}

const productSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    coverPhoto: { type: String },
    name: { type: String, require: true },
    description: { type: String },
    price: { type: Number, require: true },
    establishment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'establishment',
      autopopulate: true
    }
  },
  {
    versionKey: false
  }
);

productSchema.plugin(autopopulate);
const Product = mongoose.model<IProduct>('product', productSchema);

export default Product;
export { IProduct };
