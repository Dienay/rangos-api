import { RequestProps, ResponseProps, NextFunctionProps, logger } from '@/config';
import NotFound from '@/errors/NotFound';
import { IEstablishment } from '@/models/Establishment';
import Product from '@/models/Product';
import { Establishment } from '@/models/index';
import fs from 'fs';
import path from 'path';

class EstablishmentController {
  // Create a new establishment
  static createEstablishment = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const body = req.body as IEstablishment;

      // Check if a establishment with the same name already exists
      const establishmentExists = await Establishment.findOne({ name: body.name });

      if (establishmentExists) {
        return res.status(409).json({
          message: 'Establishment with the same name already exists.'
        });
      }

      // If a cover photo is provided, save it to the uploads directory
      if (req.file) {
        body.coverPhoto = req.file.filename;
      }
      // Create a new establishment object based on the request body
      const newEstablishment = await Establishment.create(body);

      // // Save the new establishment to the database
      // await newEstablishment.save();

      // Respond with a success message and the created establishment data
      return res.status(201).json({
        message: 'Establishment created successfully.',
        data: newEstablishment
      });
    } catch (error) {
      // Pass any errors to the error handling middleware
      return next(error);
    }
  };

  // Get a list of all establishments
  static getEstablishments = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      // Fetch all establishments from the database
      const establishmentList = await Establishment.find({});

      const establishmentsWithPhotoURL = establishmentList.map((establishment) => ({
        ...establishment.toObject(),
        coverPhoto: `${req.protocol}://${req.get('host')}/uploads/establishments/${establishment.coverPhoto}`
      }));

      // Respond with the list of establishments
      res.status(200).json({
        establishments: establishmentsWithPhotoURL
      });
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

      if (foundEstablishment) {
        foundEstablishment.coverPhoto = `${req.protocol}://${req.get('host')}/uploads/establishments/${foundEstablishment.coverPhoto}`;
      }

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

  static getEstablishmentWithProducts = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      // Extracting establishment ID from request parameters
      const { id } = req.params;

      // Finding establishment by ID
      const establishment = await Establishment.findById(id);

      if (establishment) {
        establishment.coverPhoto = `${req.protocol}://${req.get('host')}/uploads/establishments/${establishment.coverPhoto}`;

        // If establishment is found, finding all products associated with the establishment
        const productList = await Product.find({ establishment: id }).lean();

        const productWithCoverPhotoURL = productList.map((product) => ({
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-underscore-dangle
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          coverPhoto: `${req.protocol}://${req.get('host')}/uploads/products/${product.coverPhoto}`
        }));

        if (productWithCoverPhotoURL.length > 0) {
          // If products are found, sending a success response with the list of products
          res.status(200).json({
            establishment: {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-underscore-dangle
              id: establishment._id,
              name: establishment.name,
              coverPhoto: establishment.coverPhoto,
              category: establishment.category,
              deliveryTime: establishment.deliveryTime,
              shipping: establishment.shipping,
              address: establishment.address
            },
            products: productWithCoverPhotoURL
          });
        } else {
          // If no products are found, passing a NotFound error to the error handling middleware
          res.status(200).json({
            establishment: { name: establishment.name, coverPhoto: establishment.coverPhoto },
            products: []
          });
        }
      } else {
        // If establishment is not found, passing a NotFound error to the error handling middleware
        next(new NotFound('Establishment Id not found.'));
      }
    } catch (error) {
      // Passing any error to the error handling middleware
      next(error);
    }
  };

  // Update an establishment
  static updateEstablishment = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      // Extract the ID from the request parameters and new data from the request body
      const { id } = req.params;
      const newData = req.body as Partial<IEstablishment>;

      const foundEstablishment = await Establishment.findById(id);

      if (!foundEstablishment) {
        throw new NotFound('Establishment Id not found.');
      }

      if (req.file) {
        if (foundEstablishment.coverPhoto) {
          const coverPhotoPath = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            'establishments',
            path.basename(foundEstablishment.coverPhoto)
          );

          if (fs.existsSync(coverPhotoPath)) {
            try {
              fs.unlinkSync(coverPhotoPath);
            } catch (unlinkError) {
              logger.error(`Error deleting file: ${(unlinkError as Error).message}`);
              return next(new Error('Error deleting old image file.'));
            }
          }
        }

        newData.coverPhoto = req.file.filename;
      }

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

      // Find the establishment by its ID
      const foundEstablishment = await Establishment.findById(id);

      if (foundEstablishment?.coverPhoto) {
        const coverPhotoPath = path.join(
          __dirname,
          '..',
          '..',
          'uploads',
          'establishments',
          path.basename(foundEstablishment.coverPhoto)
        );

        if (fs.existsSync(coverPhotoPath)) {
          try {
            fs.unlinkSync(coverPhotoPath);
          } catch (unlinkError) {
            logger.error(`Error deleting file: ${(unlinkError as Error).message}`);
            return next(new Error('Error deleting associated image file.'));
          }
        }
      }

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
    return undefined;
  };

  static filterEstablishment = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { name } = req.query;
      const search: { [key: string]: unknown } = {};

      if (typeof name === 'string') {
        search.name = { $regex: name, $options: 'i' };
      }

      const establishments = await Establishment.find(search);

      if (establishments.length > 0) {
        res.status(200).json({ establishments });
      } else {
        const establishmentName = typeof name === 'string' ? name : '';
        res.status(200).json({ message: `Establishment ( ${establishmentName} ) is not found.` });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default EstablishmentController;
