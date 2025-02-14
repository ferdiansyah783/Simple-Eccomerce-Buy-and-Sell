import express from "express";
import cors from "cors";
import productRouter from "./routes/productRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import userRouter from "./routes/userRoute.js";
import orderRoute from "./routes/orderRoute.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/users", userRouter);
app.use("/api/products", productRouter);
app.use("/api/categories", categoryRoute);
app.use("/api/orders", orderRoute);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export default app;
