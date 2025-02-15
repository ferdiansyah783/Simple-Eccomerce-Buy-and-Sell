import express from "express";
const orderRoute = express.Router();
import authenticate from "../middleware/auth.js";
import {
  createOrder,
  getAllOrders,
  getOrderHistory,
  updateOrderStatus,
} from "../controllers/orderController.js";

// Rute untuk mendapatkan kategori produk
orderRoute.post("/checkout", authenticate, createOrder);
orderRoute.put("/:orderId", authenticate, updateOrderStatus);
orderRoute.get("/order", authenticate, getOrderHistory);
orderRoute.get("/", authenticate, getAllOrders);

export default orderRoute;
