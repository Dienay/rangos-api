import mongoose from 'mongoose';

interface IEstablishment extends Document {
  id: mongoose.Types.ObjectId;
  coverPhoto: string;
  name: string;
  openingHours: OpeningHour[];
  address: Address[];
  category: Category[];
}

interface OpeningHour {
  openDays: OpenDay[];
  hours: Hour[];
}

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

function validateHour(value: string) {
  const hourFormat = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return hourFormat.test(value) || value.toLowerCase() === 'closed';
}

interface Hour {
  open: string;
  close: string;
}

interface Address {
  description: string;
  street: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

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
                    validator: validateHour,
                    message: `Opening hour must be in ( HH:MM ) format. ( {VALUE} ) is not a valid hour format.`
                  }
                },
                close: {
                  type: String,
                  validate: {
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
          values: Object.values(Category),
          message: `( {VALUE} ) is not a valid establishment category. Allowed categories are: ${Object.values(Category).join(', ')}`
        }
      }
    ]
  },
  {
    versionKey: false
  }
);

const Establishment = mongoose.model<IEstablishment>('establishment', establishmentSchema);

export default Establishment;
export { IEstablishment };
