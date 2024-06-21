import mongoose from 'mongoose';

// Define the Address interface representing the address structure
export interface IAddress extends mongoose.Document {
  description: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

// Definindo o esquema para o endereço
const addressSchema = new mongoose.Schema({
  description: { type: String },
  street: { type: String, required: true },
  number: { type: String, required: true },
  complement: { type: String },
  neighborhood: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true }
});

export { addressSchema };
