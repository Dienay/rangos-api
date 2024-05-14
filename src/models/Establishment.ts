import mongoose, { Document } from "mongoose";

interface IEstablishment extends Document {
  _id: mongoose.Types.ObjectId;
  coverPhoto: string;
  name: string;
  openingHours: object[],
  address: object[];
  category: string[];
}

const establishmentSchema = new mongoose.Schema({
  id: { type: mongoose.Schema.Types.ObjectId },
  coverPhoto: { type: String },
  name: { type: String, require: true },
  openingHours: [{ type: Object }],
  address: [{ type: Object }],
  category: [{ type: String }]
});

const Establishment = mongoose.model<IEstablishment>("establishment", establishmentSchema);

export default Establishment;