import { Router } from 'express';
import ProductsController from '../controllers/productController';

export const productsRouter = Router();

const { createProduct } = ProductsController;
const { getProducts } = ProductsController;
const { getProductById } = ProductsController;
const { updateProduct } = ProductsController;
const { deleteProduct } = ProductsController;
const { getProductsByEstablishment } = ProductsController;

productsRouter.post('/products', createProduct);
productsRouter.get('/products', getProducts);
productsRouter.get('/products/establishment/:establishmentId', getProductsByEstablishment);
productsRouter.get('/products/:id', getProductById);
productsRouter.put('/products/:id', updateProduct);
productsRouter.delete('/products/:id', deleteProduct);
