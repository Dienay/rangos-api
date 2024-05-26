import mongoose from 'mongoose';
import { Address } from './Address';

// Define the IEstablishment interface extending mongoose.Document, representing an establishment structure
interface IEstablishment extends mongoose.Document {
  id: mongoose.Types.ObjectId;
  coverPhoto: string;
  name: string;
  openingHours: OpeningHour[];
  address: Address[];
  category: Category[];
}

// Define the OpeningHour interface representing the opening hours structure
interface OpeningHour {
  openDays: OpenDay[];
  hours: Hour[];
}

// Enum for the days the establishment is open
enum OpenDay {
  EveryDay = 'Every day',
  Friday = 'Friday',
  Monday = 'Monday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
  Thursday = 'Thursday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday'
}

// Function to validate the hour format (HH:MM) or 'closed'
function validateHour(value: string) {
  // Regex for HH:MM format
  const hourFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
  // Validates if the value matches the format or is 'closed'
  return hourFormat.test(value) || value.toLowerCase() === 'closed';
}

// Define the Hour interface representing the opening and closing times
interface Hour {
  open: string;
  close: string;
}

// Enum for the establishment categories
enum Category {
  Restaurant = 'Restaurant',
  CoffeeShop = 'Coffee Shop',
  Bakery = 'Bakery',
  Pizzeria = 'Pizzeria',
  PizzaPlace = 'Pizza Place',
  IceCreamParlor = 'Ice Cream Parlor',
  IceCreamShop = 'Ice Cream Shop',
  Cafeteria = 'Cafeteria',
  SandwichShop = 'Sandwich Shop',
  Store = 'Store',
  ElectronicsStore = 'Electronics Store',
  FastFoodRestaurant = 'Fast Food Restaurant',
  GroceryStore = 'Grocery Store',
  MexicanRestaurant = 'Mexican Restaurant'
}

// Define the schema for the establishment
const establishmentSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    coverPhoto: { type: String },
    name: { type: String, required: [true, 'Establishment name is required'] },
    openingHours: {
      type: [
        {
          openDays: {
            type: [String],
            enum: {
              // Allowed values for open days
              values: Object.values(OpenDay),
              message: `( {VALUE} ) is not a valid open day. Allowed open days are: ${Object.values(OpenDay).join(', ')}`
            }
          },
          hours: {
            type: [
              {
                open: {
                  type: String,
                  validate: {
                    // Validator function for the opening time
                    validator: validateHour,
                    message: `Opening hour must be in ( HH:MM ) format. ( {VALUE} ) is not a valid hour format.`
                  }
                },
                close: {
                  type: String,
                  validate: {
                    // Validator function for the closing time
                    validator: validateHour,
                    message: `Closing hour must be in ( HH:MM ) format. ( {VALUE} ) is not a valid hour format.`
                  }
                }
              }
            ]
          }
        }
      ]
    },
    address: {
      type: [
        {
          description: { type: String },
          street: { type: String },
          number: { type: String },
          complement: { type: String },
          neighborhood: { type: String },
          city: { type: String },
          state: { type: String }
        }
      ]
    },
    category: [
      {
        type: String,
        enum: {
          // Allowed values for categories
          values: Object.values(Category),
          message: `( {VALUE} ) is not a valid establishment category. Allowed categories are: ${Object.values(Category).join(', ')}`
        }
      }
    ]
  },
  {
    // Remove the version key (__v) from the documents
    versionKey: false
  }
);

// Create the Establishment model using the defined schema and IEstablishment interface
const Establishment = mongoose.model<IEstablishment>('establishment', establishmentSchema);

export default Establishment;
export { IEstablishment };
