import { RequestProps, ResponseProps, NextFunctionProps, logger } from '@/config';
import NotFound from '@/errors/NotFound';
import { IProduct } from '@/models/Product';
import { Establishment, Product } from '@/models/index';
import path from 'path';
import fs from 'fs';

class ProductsController {
  // Method to create a new product
  static createProduct = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const body = req.body as IProduct;

      if (req.file) {
        body.coverPhoto = req.file.filename;
      }

      // Creating a new product with data from request body
      const newProduct = await Product.create(body);

      // Saving the new product to the database
      await newProduct.save();

      // Sending a success response with the created product data
      res.status(201).json({
        message: 'Product created successfully.',
        data: newProduct
      });
    } catch (error) {
      // Passing any error to the error handling middleware
      next(error);
    }
  };

  // Method to get all products
  static getProducts = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      // Finding all products
      const productList = await Product.find({});

      const productWithCoverPhotoURL = productList.map((product) => ({
        ...product.toObject(),
        coverPhoto: `${req.protocol}://${req.get('host')}/uploads/products/${product.coverPhoto}`
      }));

      // Sending a success response with the list of products
      res.status(200).json({ products: productWithCoverPhotoURL });
    } catch (error) {
      // Passing any error to the error handling middleware
      next(error);
    }
  };

  // Method to get a product by its ID
  static getProductById = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      // Extracting product ID from request parameters
      const { id } = req.params;
      // Finding product by ID
      const foundProduct = await Product.findById(id);

      if (foundProduct) {
        foundProduct.coverPhoto = `${req.protocol}://${req.get('host')}/uploads/products/${foundProduct.coverPhoto}`;
      }

      if (foundProduct !== null) {
        // If product is found, sending a success response with the product data
        res.status(200).json(foundProduct);
      } else {
        // If product is not found, passing a NotFound error to the error handling middleware
        next(new NotFound('Product Id not found.'));
      }
    } catch (error) {
      // Passing any error to the error handling middleware
      next(error);
    }
  };

  // Method to update a product
  static updateProduct = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      // Extracting product ID from request parameters
      const { id } = req.params;
      // Extracting updated data from request body
      const newData = req.body as Partial<IProduct>;
      // Validating updated data

      const foundProduct = await Product.findById(id);

      if (!foundProduct) {
        throw new NotFound('Product Id not found.');
      }

      if (req.file) {
        if (foundProduct.coverPhoto) {
          const coverPhotoPath = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            'products',
            path.basename(foundProduct.coverPhoto)
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

      const validationError = new Product(newData).validateSync();
      if (validationError) {
        // If validation fails, passing the error to the error handling middleware
        return next(validationError);
      }

      // Updating product and sending a success response with the updated product data
      const updatedProduct = await Product.findByIdAndUpdate(id, { $set: newData }, { new: true });

      if (updatedProduct !== null) {
        res.status(200).json({
          message: 'Product updated successfully',
          product: newData
        });
      } else {
        next(new NotFound('Product Id not found.'));
      }
    } catch (error) {
      // Passing any error to the error handling middleware
      return next(error);
    }

    return undefined;
  };

  // Method to delete a product
  static deleteProduct = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      // Extracting product ID from request parameters
      const { id } = req.params;

      const foundProduct = await Product.findById(id);

      if (foundProduct?.coverPhoto) {
        const coverPhotoPath = path.join(
          __dirname,
          '..',
          '..',
          'uploads',
          'products',
          path.basename(foundProduct.coverPhoto)
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

      // Deleting product by ID
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (deletedProduct !== null) {
        // If product is deleted successfully, sending a success response with deleted product data
        res.status(200).json({
          message: 'Product deleted successfully',
          data: deletedProduct
        });
      } else {
        // If product is not found, passing a NotFound error to the error handling middleware
        next(new NotFound('Product Id not found.'));
      }
    } catch (error) {
      // Passing any error to the error handling middleware
      next(error);
    }
  };

  // Method to get all products by establishment ID
  static getProductsByEstablishment = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      // Extracting establishment ID from request parameters
      const { establishmentId } = req.params;

      // Finding establishment by ID
      const establishment = await Establishment.findById(establishmentId);

      if (establishment !== null) {
        // If establishment is found, finding all products associated with the establishment
        const productList: IProduct[] = await Product.find({ establishment: establishmentId });

        if (productList.length > 0) {
          // If products are found, sending a success response with the list of products
          res.status(200).json(productList);
        } else {
          // If no products are found, passing a NotFound error to the error handling middleware
          res.status(200).json('Product list empty.');
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

  static filterProduct = async (req: RequestProps, res: ResponseProps, next: NextFunctionProps) => {
    try {
      const { name } = req.query;

      const search: { [key: string]: unknown } = {};

      if (typeof name === 'string') {
        search.name = { $regex: name, $options: 'i' };
      }

      const products = await Product.find(search);

      if (products.length > 0) {
        res.status(200).json(products);
      } else {
        const productName = typeof name === 'string' ? name : '';
        res.status(200).json({ message: `Product ( ${productName} ) is not found.` });
      }
    } catch (error) {
      next(error);
    }
  };
}

export default ProductsController;
