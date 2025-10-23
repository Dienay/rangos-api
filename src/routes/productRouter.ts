import { Router } from 'express';
import ProductsController from '../controllers/productController';
import { productsUpload } from '../config/multer';

// Creating a new router instance
export const productsRouter = Router();

// Destructuring methods from ProductsController
const { createProduct, getProducts, getTopProducts, getProductById, updateProduct, deleteProduct, filterProduct } =
  ProductsController;

// Defining routes for products
productsRouter.post('/products', productsUpload.single('productImage'), createProduct);
productsRouter.get('/products', getProducts);
productsRouter.get('/products/top', getTopProducts);
productsRouter.get('/products/search', filterProduct);
productsRouter.get('/products/:id', getProductById);
productsRouter.put('/products/:id', productsUpload.single('productImage'), updateProduct);
productsRouter.delete('/products/:id', deleteProduct);
