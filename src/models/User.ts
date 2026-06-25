import mongoose from 'mongoose';
import { IAddress, addressSchema } from './Address';

enum TypeUser {
  Customer = 'Customer',
  Establishment = 'Establishment'
}
// Define the IUser interface extending mongoose.Document to ensure correct typing for Mongoose documents.
interface IUser extends mongoose.Document {
  avatar: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: IAddress[];
  typeUser: TypeUser;
}

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    avatar: { type: String },
    name: {
      type: String,
      required: [true, 'Name is required'],
      maxlength: [100, 'Name must be at most 100 characters.'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format.']
    },
    phone: { type: String, unique: true },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters.']
    },
    address: [addressSchema],
    typeUser: {
      type: String,
      default: TypeUser.Customer,
      enum: {
        values: Object.values(TypeUser),
        message: `( {VALUE} ) is not a valid user type. Allowed types are: ${Object.values(TypeUser).join(', ')}`
      }
    }
  },
  {
    // Remove the version key (__v) from the documents
    versionKey: false
  }
);

// Create the User model using the userSchema
const User = mongoose.model<IUser>('user', userSchema);

export default User;
export { IUser };
