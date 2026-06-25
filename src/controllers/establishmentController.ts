import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config';
import NotFound from '../errors/NotFound';
import { IEstablishment } from '../models/Establishment';
import Product from '../models/Product';
import { Establishment } from '../models/index';

class EstablishmentController {
  static createEstablishment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as IEstablishment;

      const establishmentExists = await Establishment.findOne({ name: body.name });

      if (establishmentExists) {
        return res.status(409).json({
          message: 'Establishment with the same name already exists.'
        });
      }

      if (req.file) {
        body.logo = req.file.filename;
      }
      const newEstablishment = await Establishment.create(body);

      await newEstablishment.save();

      return res.status(201).json({
        message: 'Establishment created successfully.',
        data: newEstablishment
      });
    } catch (error) {
      return next(error);
    }
  };

  static getEstablishments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const establishmentList = await Establishment.find({});

      const establishmentsWithPhotoURL = establishmentList.map((establishment) => ({
        ...establishment.toObject(),
        logo: `${req.protocol}://${req.get('host')}/uploads/establishments/${establishment.logo}`
      }));

      res.status(200).json({
        establishments: establishmentsWithPhotoURL
      });
    } catch (error) {
      next(error);
    }
  };

  static getEstablishmentById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const foundEstablishment = await Establishment.findById(id);

      if (foundEstablishment) {
        foundEstablishment.logo = `${req.protocol}://${req.get('host')}/uploads/establishments/${foundEstablishment.logo}`;
      }

      if (foundEstablishment !== null) {
        res.status(200).json(foundEstablishment);
      } else {
        next(new NotFound('Establishment Id not found.'));
      }
    } catch (error) {
      next(error);
    }
  };

  static getEstablishmentWithProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const establishment = await Establishment.findById(id);

      if (establishment) {
        establishment.logo = `${req.protocol}://${req.get('host')}/uploads/establishments/${establishment.logo}`;

        const productList = await Product.find({ establishmentId: id }).lean();

        const productWithProductImageURL = productList.map((product) => ({
          id: product._id,
          name: product.name,
          description: product.description,
          price: product.price,
          productImage: `${req.protocol}://${req.get('host')}/uploads/products/${product.productImage}`
        }));

        if (productWithProductImageURL.length > 0) {
          res.status(200).json({
            establishment: {
              id: establishment._id,
              name: establishment.name,
              logo: establishment.logo,
              category: establishment.category,
              deliveryTime: establishment.deliveryTime,
              shippingCost: establishment.shippingCost,
              address: establishment.address
            },
            products: productWithProductImageURL
          });
        } else {
          res.status(200).json({
            establishment: { name: establishment.name, logo: establishment.logo },
            products: []
          });
        }
      } else {
        next(new NotFound('Establishment Id not found.'));
      }
    } catch (error) {
      next(error);
    }
  };

  static updateEstablishment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const newData = req.body as Partial<IEstablishment>;

      const foundEstablishment = await Establishment.findById(id);

      if (!foundEstablishment) {
        throw new NotFound('Establishment Id not found.');
      }

      if (req.file) {
        if (foundEstablishment.logo) {
          const logoPath = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            'establishments',
            path.basename(foundEstablishment.logo)
          );

          if (fs.existsSync(logoPath)) {
            try {
              fs.unlinkSync(logoPath);
            } catch (unlinkError) {
              logger.error(`Error deleting file: ${(unlinkError as Error).message}`);
              return next(new Error('Error deleting old image file.'));
            }
          }
        }

        newData.logo = req.file.filename;
      }

      const validationError = new Establishment(newData).validateSync();
      if (validationError) {
        return next(validationError);
      }

      const updatedEstablishment = await Establishment.findByIdAndUpdate(id, { $set: newData }, { new: true });

      if (updatedEstablishment !== null) {
        res.status(200).json({
          message: 'Establishment updated successfully',
          data: updatedEstablishment
        });
      } else {
        throw new NotFound('Establishment Id not found.');
      }
    } catch (error) {
      next(error);
    }
    return undefined;
  };

  static deleteEstablishment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const foundEstablishment = await Establishment.findById(id);

      if (foundEstablishment?.logo) {
        const logoPath = path.join(
          __dirname,
          '..',
          '..',
          'uploads',
          'establishments',
          path.basename(foundEstablishment.logo)
        );

        if (fs.existsSync(logoPath)) {
          try {
            fs.unlinkSync(logoPath);
          } catch (unlinkError) {
            logger.error(`Error deleting file: ${(unlinkError as Error).message}`);
            return next(new Error('Error deleting associated image file.'));
          }
        }
      }

      const deletedEstablishment = await Establishment.findByIdAndDelete(id);

      if (deletedEstablishment !== null) {
        res.status(200).json({
          message: 'Establishment deleted successfully',
          data: deletedEstablishment
        });
      } else {
        throw new NotFound('Establishment Id not found.');
      }
    } catch (error) {
      next(error);
    }
    return undefined;
  };

  static filterEstablishment = async (req: Request, res: Response, next: NextFunction) => {
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
