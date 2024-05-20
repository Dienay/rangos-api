import { Product } from '../models/index';
import { RequestProps, ResponseProps, NextFunctionProps } from '@/config';

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
      res.status(500).json({
        message: `${(error as Error).message} - Product created failed.`
      });
    }
  }

  static async getProducts(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const productList = await Product.find({}).populate('establishment').exec();

      res.status(200).json(productList);
    } catch (error) {
      res.status(500).json({
        message: `${(error as Error).message} - Request failed.`
      });
    }
  }

  static async getProductById(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const { id } = req.params;
      const foundProduct = await Product.findById(id).populate('establishment').exec();

      res.status(200).json(foundProduct);
    } catch (error) {
      res.status(404).json({
        message: `${(error as Error).message} - Product not found.`
      });
    }
  }

  static async updateProduct(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const { id } = req.params;
      await Product.findByIdAndUpdate(id, req.body);

      res.status(200).json({
        message: 'Product updated successfully',
        data: req.body
      });
    } catch (error) {
      res.status(404).json({
        message: `${(error as Error).message} - Not possible update Product.`
      });
    }
  }

  static async deleteProduct(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const { id } = req.params;
      const deletedProduct = await Product.findByIdAndDelete(id);

      res.status(200).json({
        message: 'Product deleted successfully',
        data: deletedProduct
      });
    } catch (error) {
      res.status(404).json({
        message: `${(error as Error).message} - Not possible delete Product.`
      });
    }
  }

  static async getProductsByEstablishment(this: void, req: RequestProps, res: ResponseProps, next: NextFunctionProps) {
    try {
      const { establishmentId } = req.params;
      const productList = await Product.find({ establishment: establishmentId });

      res.status(200).json(productList);
    } catch (error) {
      res.status(500).json({
        message: `${(error as Error).message} - Failed to retrieve products.`
      });
    }
  }
}

export default ProductsController;
