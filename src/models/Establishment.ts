/**
 * models/Establishment.ts
 *
 * Mongoose model representing business establishments (restaurants, cafés, stores, etc.).
 * Fully aligned with the new JSON structure used in establishments_final.json.
 */

import mongoose from 'mongoose';
import { IAddress, addressSchema } from './Address';

/* ============================================================
  =============== INTERFACES & TYPE DEFINITIONS ===============
   ============================================================ */

/**
 * Represents a single open/close period during a day.
 * Example: { open: "08:00", close: "18:00" }
 */
interface IPeriod {
  open: string; // Exemplo: "06:30"
  close: string; // Exemplo: "22:00"
}

/**
 * Represents the opening hours for a specific day.
 * Example:
 * { day: "Monday", periods: [{ open: "08:00", close: "18:00" }] }
 */
interface IOpeningHour {
  day: string;
  periods: IPeriod[];
}

/**
 * Represents the estimated delivery time for the establishment.
 * Example: { min: 20, max: 40 }
 */
interface IDeliveryTIme {
  min: number;
  max: number;
}

/**
 * Represents the establishment’s rating (average and total number of reviews).
 * Example: { average: 4.5, count: 230 }
 */
interface IRating {
  average: number;
  count: number;
}

/**
 * Enum listing all valid establishment categories.
 * Helps maintain data consistency across the database.
 */
enum Category {
  Bakery = 'Bakery',
  Bar = 'Bar',
  CoffeeShop = 'Coffee Shop',
  ElectronicsStore = 'Electronics Store',
  FastFoodRestaurant = 'Fast Food Restaurant',
  FoodTruck = 'Food Truck',
  GroceryStore = 'Grocery Store',
  HealthyFood = 'Healthy Food',
  IceCreamParlor = 'Ice Cream Parlor',
  IceCreamShop = 'Ice Cream Shop',
  ItalianRestaurant = 'Italian Restaurant',
  DessertShop = 'Dessert Shop',
  JuiceBar = 'Juice Bar',
  MexicanRestaurant = 'Mexican Restaurant',
  PizzaPlace = 'Pizza Place',
  Pizzeria = 'Pizzeria',
  Pub = 'Pub',
  Restaurant = 'Restaurant',
  SandwichShop = 'Sandwich Shop',
  SeafoodRestaurant = 'Seafood Restaurant',
  Steakhouse = 'Steakhouse',
  VeganRestaurant = 'Vegan Restaurant',
  Store = 'Store',
  SushiBar = 'Sushi Bar',
  Bistro = 'Bistro'
}

/**
 * Main interface describing an establishment document.
 * Defines all fields stored in the MongoDB collection.
 */
interface IEstablishment extends mongoose.Document {
  logo?: string;
  coverImage?: string;
  name: string;
  openingHours: IOpeningHour[];
  address: IAddress[];
  category: Category;
  deliveryTime: IDeliveryTIme;
  shippingCost: number;
  phone?: string;
  email?: string;
  rating?: IRating;
  paymentMethods?: string[];
  services?: string[];
}

/* ============================================================
  ================= VALIDATION & ENUMS ========================
   ============================================================ */

/**
 * Valid days of the week.
 * Used to validate the "day" field within openingHours.
 */

const WeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

/**
 * Validates that a time string is in 24-hour format (HH:mm).
 */
function validateHour(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

/* ============================================================
  ================== NESTED SCHEMAS ===========================
   ============================================================ */

/**
 * Sub-schema representing a single opening/closing period.
 * Example:
 * { open: "08:00", close: "18:00" }
 */

const periodSchema = new mongoose.Schema(
  {
    open: {
      type: String,
      required: true,
      validate: {
        validator: validateHour,
        message: '{VALUE} is not a valid time. Use HH:mm format.'
      }
    },
    close: {
      type: String,
      required: true,
      validate: {
        validator: validateHour,
        message: '{VALUE} is not a valid time. Use HH:mm format.'
      }
    }
  },
  { _id: false }
);

/**
 * Sub-schema representing the opening hours for a single day.
 * Example:
 * {
 *   day: "Monday",
 *   periods: [{ open: "08:00", close: "18:00" }]
 * }
 */
const openingHourSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: WeekDays,
      required: true
    },
    periods: { type: [periodSchema], require: true }
  },
  { _id: false }
);

/**
 * Sub-schema for estimated delivery time.
 * Example:
 * { min: 20, max: 40 }
 */
const deliveryTimeSchema = new mongoose.Schema(
  {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

/**
 * Sub-schema for contact fields.
 * Example:
 * { phone: "+55 (21) 96561-2361", email: "contato@joaosrestaurant.com.br" }
 */
const contactSchema = new mongoose.Schema(
  {
    phone: { type: String },
    email: { type: String }
  },
  { _id: false }
);

/**
 * Sub-schema for customer ratings.
 * Example:
 * { average: 4.6, count: 120 }
 */
const ratingSchema = new mongoose.Schema(
  {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  { _id: false }
);

/* ============================================================
  ===================== MAIN SCHEMA ===========================
   ============================================================ */

/**
 * Main Establishment schema.
 * Combines all nested schemas and defines field-level validation.
 */

const establishmentSchema = new mongoose.Schema(
  {
    logo: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    name: { type: String, required: [true, 'Establishment name is required'] },
    openingHours: {
      type: [openingHourSchema],
      required: true,
      _id: false
    },
    address: [addressSchema],
    category: {
      type: String,
      enum: {
        // Allowed values for categories
        values: Object.values(Category),
        message: `( {VALUE} ) is not a valid establishment category. Allowed categories are: ${Object.values(Category).join(', ')}`
      }
    },
    deliveryTime: { type: deliveryTimeSchema },
    shippingCost: { type: Number, min: 0 },
    contact: { type: contactSchema, default: '' },
    email: { type: String, default: '' },
    rating: { type: ratingSchema, default: { average: 0, count: 0 } },
    paymentMethods: { type: [String], default: [] },
    services: { type: [String], default: [] }
  },
  {
    // Remove the version key (__v) from the documents
    versionKey: false
  }
);

/* ============================================================
  ====================== MODEL EXPORT =========================
   ============================================================ */

/**
 * Creates and exports the Mongoose model for Establishments.
 * The corresponding MongoDB collection name will be 'establishments'.
 */

const Establishment = mongoose.model<IEstablishment>('establishment', establishmentSchema);

export default Establishment;
export { IEstablishment, Category };
