import { RequestProps, ResponseProps, NextFunctionProps } from '@/config';
import NotFound from '@/errors/NotFound';
import { IEstablishment } from '@/models/Establishment';
import { Establishment } from '@/models/index';

class EstablishmentController {
  // Create a new establishment
  static createEstablishment = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      // Create a new establishment object based on the request body
      const newEstablishment = await Establishment.create(req.body);

      // Save the new establishment to the database
      await newEstablishment.save();

      // Respond with a success message and the created establishment data
      res.status(201).json({
        message: 'Establishment created successfully.',
        data: newEstablishment
      });
    } catch (error) {
      // Pass any errors to the error handling middleware
      next(error);
    }
  };

  // Get a list of all establishments
  static getEstablishments = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      // Fetch all establishments from the database
      const establishmentList = await Establishment.find({});

      // Respond with the list of establishments
      res.status(200).json(establishmentList);
    } catch (error) {
      // Pass any errors to the error handling middleware
      next(error);
    }
  };

  // Get an establishment by ID
  static getEstablishmentById = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      // Extract the ID from the request parameters
      const { id } = req.params;

      // Find the establishment by its ID
      const foundEstablishment = await Establishment.findById(id);

      // If the establishment is found, respond with it; otherwise, throw a NotFound error
      if (foundEstablishment !== null) {
        res.status(200).json(foundEstablishment);
      } else {
        next(new NotFound('Establishment Id not found.'));
      }
    } catch (error) {
      // Pass any errors to the error handling middleware
      next(error);
    }
  };

  // Update an establishment
  static updateEstablishment = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      // Extract the ID from the request parameters and new data from the request body
      const { id } = req.params;
      const newData = req.body as Partial<IEstablishment>;

      // Validate the new data using Mongoose validation
      const validationError = new Establishment(newData).validateSync();
      if (validationError) {
        // If validation fails, pass the error to the error handling middleware
        return next(validationError);
      }

      // Find and update the establishment by its ID
      const updatedEstablishment = await Establishment.findByIdAndUpdate(id, { $set: newData }, { new: true });

      // If the establishment is updated successfully, respond with it; otherwise, throw a NotFound error
      if (updatedEstablishment !== null) {
        res.status(200).json({
          message: 'Establishment updated successfully',
          data: updatedEstablishment
        });
      } else {
        throw new NotFound('Establishment Id not found.');
      }
    } catch (error) {
      // Pass any errors to the error handling middleware
      next(error);
    }
    return undefined;
  };

  // Delete an establishment
  static deleteEstablishment = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      // Extract the ID from the request parameters
      const { id } = req.params;

      // Find and delete the establishment by its ID
      const deletedEstablishment = await Establishment.findByIdAndDelete(id);

      // If the establishment is deleted successfully, respond with it; otherwise, throw a NotFound error
      if (deletedEstablishment !== null) {
        res.status(200).json({
          message: 'Establishment deleted successfully',
          data: deletedEstablishment
        });
      } else {
        throw new NotFound('Establishment Id not found.');
      }
    } catch (error) {
      // Pass any errors to the error handling middleware
      next(error);
    }
  };
}

export default EstablishmentController;
