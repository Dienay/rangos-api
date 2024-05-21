import mongoose from 'mongoose';

// Set a global validation rule for String schema types in Mongoose
mongoose.Schema.Types.String.set('validate', {
  // Validator function to check if the string is not empty after trimming whitespace
  validator: (value: string) => value.trim() !== '',

  // Custom error message to be used if the validation fails
  message: ({ path }: { path: string }) => `Empty string provided for the field (${path})`
});
