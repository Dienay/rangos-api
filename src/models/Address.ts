import mongoose from 'mongoose';

export interface IAddress extends mongoose.Document {
  description?: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export const addressSchema = new mongoose.Schema(
  {
    description: { type: String, trim: true },
    street: { type: String, required: [true, 'Street is required'], trim: true },
    number: { type: String, required: [true, 'Number is required'], trim: true },
    complement: { type: String, trim: true },
    neighborhood: { type: String, trim: true },
    city: { type: String, required: [true, 'City is required'], trim: true },
    state: { type: String, required: [true, 'State is required'], trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, default: 'Unknown' }
  },
  { _id: false }
);
