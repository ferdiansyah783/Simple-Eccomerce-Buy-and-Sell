import express from "express";
const productRouter = express.Router();
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

// Rute untuk mendapatkan produk
productRouter.get("/", getProducts);

// Rute untuk menambahkan produk
productRouter.post("/", addProduct);

// Rute untuk mengedit produk
productRouter.put("/:id", updateProduct);

// Rute untuk menghapus produk
productRouter.delete("/:id", deleteProduct);

export default productRouter;
