import express from "express";
const categoryRoute = express.Router();

import { getCategories } from "../controllers/categoryController.js";

// Rute untuk mendapatkan kategori produk
categoryRoute.get("/", getCategories);

export default categoryRoute;
