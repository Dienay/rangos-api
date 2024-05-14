import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  coverPhoto: { type: String },
  name: { type: String, require: true },
  description: { type: String },
  price: { type: Number, require: true },
  establishment: { type: mongoose.Schema.Types.ObjectId, ref: "establishment" }
});

const Product = mongoose.model("product", productSchema);

export default Product;