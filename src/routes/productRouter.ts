import { Router } from 'express';
import ProductsController from '../controllers/productController';
import { productsUpload } from '../config/multer';

// Creating a new router instance
export const productsRouter = Router();

// Destructuring methods from ProductsController
const { createProduct, getProducts, getProductById, updateProduct, deleteProduct, filterProduct } = ProductsController;

// Defining routes for products
productsRouter.post('/products', productsUpload.single('coverPhoto'), createProduct);
productsRouter.get('/products', getProducts);
productsRouter.get('/products/search', filterProduct);
productsRouter.get('/products/:id', getProductById);
productsRouter.put('/products/:id', productsUpload.single('coverPhoto'), updateProduct);
productsRouter.delete('/products/:id', deleteProduct);
