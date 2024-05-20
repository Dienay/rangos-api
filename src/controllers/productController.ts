import { Product } from '../models/index';
import { RequestProps, ResponseProps, NextFunctionProps } from '@/config';
import NotFound from '@/errors/NotFound';

class ProductsController {
  static async createProduct(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const newProduct = await Product.create(req.body);

      await newProduct.save();

      res.status(201).json({
        message: 'Product created successfully.',
        data: newProduct
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProducts(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const productList = await Product.find({}).populate('establishment').exec();

      res.status(200).json(productList);
    } catch (error) {
      next(error);
    }
  }

  static async getProductById(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const { id } = req.params;
      const foundProduct = await Product.findById(id).populate('establishment').exec();

      if (foundProduct !== null) {
        res.status(200).json(foundProduct);
      } else {
        next(new NotFound('Product Id not found.'));
      }
    } catch (error) {
      next(error);
    }
  }

  static async updateProduct(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const { id } = req.params;
      const newData = req.body as Partial<IProduct>;
      const validationError = new Product(newData).validateSync();

      if (validationError) {
        return next(validationError);
      }

      await Product.findByIdAndUpdate(id, { $set: newData }, { new: true });

      res.status(200).json({
        message: 'Product updated successfully',
        data: newData
      });
    } catch (error) {
      return next(error);
    }

    return undefined;
  }

  static async deleteProduct(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);

      if (deletedProduct !== null) {
        res.status(200).json({
          message: 'Product deleted successfully',
          data: deletedProduct
        });
      } else {
        next(new NotFound('Product Id not found.'));
      }
    } catch (error) {
      next(error);
    }
  }

  static async getProductsByEstablishment(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const { establishmentId } = req.params;

      const establishment = await Establishment.findById(establishmentId);

      if (establishment !== null) {
        const productList: IProduct[] = await Product.find({ establishment: establishmentId });

        if (productList.length > 0) {
          res.status(200).json(productList);
        } else {
          next(new NotFound('Product list empty.'));
        }
      } else {
        next(new NotFound('Establishment Id not found.'));
      }
    } catch (error) {
      next(error);
    }
  }
}

export default ProductsController;
