import mongoose from 'mongoose';
import { IAddress, addressSchema } from './Address';

// Define the IUser interface extending mongoose.Document to ensure correct typing for Mongoose documents.
interface IUser extends mongoose.Document {
  id: mongoose.Types.ObjectId;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  address: IAddress[];
}

// Define the schema for the User model
const userSchema = new mongoose.Schema(
  {
    id: { type: mongoose.Schema.Types.ObjectId },
    avatar: { type: String },
    name: { type: String, required: [true, 'name is required'] },
    email: { type: String, required: [true, 'email is required'], unique: true },
    phone: { type: String, unique: true },
    password: { type: String, required: [true, 'password is required'] },
    address: [addressSchema]
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
