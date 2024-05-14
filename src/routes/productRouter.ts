import { Router } from "express";
import ProductsController from "../controllers/productController";

export const productsRouter = Router();

const createProduct = ProductsController.createProduct;
const getProducts = ProductsController.getProducts;
const getProductById = ProductsController.getProductById;
const updateProduct = ProductsController.updateProduct;
const deleteProduct = ProductsController.deleteProduct;
const getProductsByEstablishment = ProductsController.getProductsByEstablishment;

productsRouter.post("/products", createProduct);
productsRouter.get("/products", getProducts);
productsRouter.get("/products/:id", getProductById);
productsRouter.put("/products/:id", updateProduct);
productsRouter.delete("/products/:id", deleteProduct);
productsRouter.get("/products/establishment/:establishmentId", getProductsByEstablishment);