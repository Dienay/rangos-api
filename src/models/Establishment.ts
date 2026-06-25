import mongoose from 'mongoose';
import { IAddress, addressSchema } from './Address';

interface IPeriod {
  open: string;
  close: string;
}

interface IOpeningHour {
  day: string;
  periods: IPeriod[];
}

interface IDeliveryTIme {
  min: number;
  max: number;
}

interface IRating {
  average: number;
  count: number;
}

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

const WeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

function validateHour(value: string) {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
}

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

const deliveryTimeSchema = new mongoose.Schema(
  {
    min: { type: Number, required: true, min: 0 },
    max: { type: Number, required: true, min: 0 }
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    phone: { type: String },
    email: { type: String }
  },
  { _id: false }
);

const ratingSchema = new mongoose.Schema(
  {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0, min: 0 }
  },
  { _id: false }
);

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
    versionKey: false
  }
);

const Establishment = mongoose.model<IEstablishment>('establishment', establishmentSchema);

export default Establishment;
export { IEstablishment, Category };
