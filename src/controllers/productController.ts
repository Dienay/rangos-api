import path from 'path';
import fs from 'fs';
import { getTopProducts } from '@/config/redis';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../config';
import NotFound from '../errors/NotFound';
import { IProduct } from '../models/Product';
import { Product } from '../models/index';

class ProductsController {
  static createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as IProduct;

      if (req.file) {
        body.productImage = req.file.filename;
      }

      const newProduct = await Product.create(body);

      await newProduct.save();

      res.status(201).json({
        message: 'Product created successfully.',
        data: newProduct
      });
    } catch (error) {
      next(error);
    }
  };

  static getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productList = await Product.find({}).populate({ path: 'establishmentId', select: 'name logo' });

      const productWithProductImageURL = productList.map((product) => ({
        ...product.toObject(),
        productImage: `${req.protocol}://${req.get('host')}/uploads/products/${product.productImage}`
      }));

      res.status(200).json({ products: productWithProductImageURL });
    } catch (error) {
      next(error);
    }
  };

  static getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const foundProduct = await Product.findById(id);

      if (foundProduct) {
        foundProduct.productImage = `${req.protocol}://${req.get('host')}/uploads/products/${foundProduct.productImage}`;
      }

      if (foundProduct !== null) {
        res.status(200).json({ product: foundProduct });
      } else {
        next(new NotFound('Product Id not found.'));
      }
    } catch (error) {
      next(error);
    }
  };

  static getTopProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topProducts = await getTopProducts();
      const baseUrl = `${req.protocol}://${req.get('host')}/uploads/products/`;

      const topProductsWithFullImageURL = topProducts.map((product) => ({
        ...product,
        productImage: baseUrl + product.productImage
      }));

      return res.status(200).json({ topProducts: topProductsWithFullImageURL });
    } catch (error) {
      return next(error);
    }
  };

  static updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const newData = req.body as Partial<IProduct>;

      const foundProduct = await Product.findById(id);

      if (!foundProduct) {
        throw new NotFound('Product Id not found.');
      }

      if (req.file) {
        if (foundProduct.productImage) {
          const productImagePath = path.join(
            __dirname,
            '..',
            '..',
            'uploads',
            'products',
            path.basename(foundProduct.productImage)
          );

          if (fs.existsSync(productImagePath)) {
            try {
              fs.unlinkSync(productImagePath);
            } catch (unlinkError) {
              logger.error(`Error deleting file: ${(unlinkError as Error).message}`);
              return next(new Error('Error deleting old image file.'));
            }
          }
        }

        newData.productImage = req.file.filename;
      }

      const validationError = new Product(newData).validateSync();
      if (validationError) {
        return next(validationError);
      }

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
      return next(error);
    }

    return undefined;
  };

  static deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const foundProduct = await Product.findById(id);

      if (foundProduct?.productImage) {
        const productImagePath = path.join(
          __dirname,
          '..',
          '..',
          'uploads',
          'products',
          path.basename(foundProduct.productImage)
        );

        if (fs.existsSync(productImagePath)) {
          try {
            fs.unlinkSync(productImagePath);
          } catch (unlinkError) {
            logger.error(`Error deleting file: ${(unlinkError as Error).message}`);
            return next(new Error('Error deleting old image file.'));
          }
        }
      }

      const deletedProduct = await Product.findByIdAndDelete(id);

      if (deletedProduct !== null) {
        res.status(200).json({
          message: 'Product deleted successfully',
          product: deletedProduct
        });
      } else {
        next(new NotFound('Product Id not found.'));
      }
    } catch (error) {
      next(error);
    }
    return undefined;
  };

  static filterProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.query;

      const search: { [key: string]: unknown } = {};

      if (typeof name === 'string') {
        search.name = { $regex: name, $options: 'i' };
      }

      const products = await Product.find(search);

      if (products.length > 0) {
        res.status(200).json({ products });
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
