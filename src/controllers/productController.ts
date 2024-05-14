import { Request, Response } from "express";
import { product } from "../models/index";

class ProductsController {
  static async createProduct(req: Request, res: Response) {
    try {
      const newProduct = await product.create(req.body);

      await newProduct.save();

      res.status(201).json({
        message: "Product created successfully.",
        data: newProduct
      });
    } catch (error) {
      res.status(500).json({
        message: `${(error as Error).message} - Product created failed.`
      })
    }
  }

  static async getProducts(req: Request, res: Response) {
    try {
      const productList = await product.find({}).populate("establishment").exec();

      res.status(200).json(productList);
    } catch (error) {
      res.status(500).json({
        message: `${(error as Error).message} - Request failed.`
      })
    }
  }

  static async getProductById(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const foundProduct = await product.findById(id).populate("establishment").exec();

      res.status(200).json(foundProduct);
    } catch (error) {
      res.status(404).json({
        message: `${(error as Error).message} - Product not found.`
      })
    }
  }

  static async updateProduct(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const updateProduct = await product.findByIdAndUpdate(id, req.body);

      res.status(200).json({
        message: 'Product updated successfully',
        data: req.body
      });
    } catch (error) {
      res.status(404).json({
        message: `${(error as Error).message} - Not possible update Product.`
      })
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const deletedProduct = await product.findByIdAndDelete(id);

      res.status(200).json({
        message: 'Product deleted successfully',
        data: deletedProduct
      });
    } catch (error) {
      res.status(404).json({
        message: `${(error as Error).message} - Not possible delete Product.`
      })
    }
  }

  static async getProductsByEstablishment(req: Request, res: Response) {
    try {
      const establishmentId = req.params.establishmentId;
      const productList = await product.find({establishment: establishmentId});

      res.status(200).json(productList);
    } catch (error) {
      res.status(500).json({
        message: `${(error as Error).message} - Failed to retrieve products.`
      });
    }
  }
}

export default ProductsController;