import mongoose from 'mongoose';

/**
 * Address Schema
 * --------------------------------------------------
 * Shared structure used by Users, Establishments and Orders
 * Represents a real-world physical location such as:
 * - A user's home address (delivery)
 * - A restaurant or store location
 * - A specific order's delivery address snapshot
 */

// TypeScript interface for Address
export interface IAddress extends mongoose.Document {
  description?: string; // Optional label, e.g. "Home", "Office", "Branch #
  street: string; // Street name (required)
  number: string; // House/building number (as string, e.g. "S/N" or "101A")
  complement?: string; // Apartment, suite, or any complement
  neighborhood?: string; // Neighborhood or district
  city: string; // City (required)
  state: string; // State or region (required)
  postalCode: string; // ZIP or postal code (optional)
  country: string; // Country (default: "Unknown")
}

// Mongoose schema for Address
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
  { _id: false } // Avoid generating an internal _id for embedded documents
);
