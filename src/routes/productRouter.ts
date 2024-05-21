import { Router } from 'express';
import ProductsController from '../controllers/productController';

// Creating a new router instance
export const productsRouter = Router();

// Destructuring methods from ProductsController
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, getProductsByEstablishment } =
  ProductsController;

// Defining routes for products
productsRouter.post('/products', createProduct);
productsRouter.get('/products', getProducts);
productsRouter.get('/products/establishment/:establishmentId', getProductsByEstablishment);
productsRouter.get('/products/:id', getProductById);
productsRouter.put('/products/:id', updateProduct);
productsRouter.delete('/products/:id', deleteProduct);
