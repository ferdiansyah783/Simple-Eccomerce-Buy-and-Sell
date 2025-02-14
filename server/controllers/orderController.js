import knex from "knex";
import { development } from "../../knexfile.js";
const db = knex(development);

// Function to get order history
export const getOrderHistory = async (req, res) => {
  const userId = req.user.id; // User ID from JWT token, assuming you set it in the middleware

  try {
    // Step 1: Get all orders for the user
    const orders = await db("orders")
      .where("user_id", userId)
      .select(
        "id",
        "total_price",
        "status",
        "payment_method",
        "address",
        "created_at"
      ); // You can customize the fields

    // Step 2: Get the items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        // Fetch order items for this order
        const orderItems = await db("order_items")
          .where("order_id", order.id)
          .join("products", "order_items.product_id", "products.id") // Join with products to get the product details
          .select(
            "order_items.product_id",
            "products.name",
            "order_items.quantity",
            "order_items.price"
          );

        return {
          orderId: order.id,
          total_price: order.total_price,
          status: order.status,
          payment_method: order.payment_method,
          address: order.address,
          order_items: orderItems,
        };
      })
    );

    // Step 3: Send the response
    res.status(200).json(ordersWithItems);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching order history" });
  }
};

// Endpoint to create an order (checkout)
export async function createOrder(req, res) {
  const userId = req.user.id; // User ID from JWT token
  const { paymentMethod, address, cartItems } = req.body; // Assuming we get payment method from request body

  try {
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Step 2: Calculate total price
    const totalPrice = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    // Step 3: Create the order
    const [orderResult] = await db("orders").insert({
      user_id: userId,
      total_price: totalPrice,
      status: "Pending",
      payment_method: paymentMethod,
      address: address,
    });

    // `orderResult` will contain the ID of the newly inserted order.
    // For MySQL, Knex returns an array with a single value, which is the inserted ID.
    const orderId = orderResult; // This is the ID of the newly created order.

    // Step 4: Add order items to the order_items table
    const orderItems = cartItems.map((item) => ({
      order_id: orderId,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    await db("order_items").insert(orderItems);

    // Step 5: Retrieve the newly created order
    const order = await db("orders").where("id", orderId).first();

    // Step 6: Respond with the order details
    res.status(201).json({ message: "Order created successfully", order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error during checkout" });
  }
}

// Endpoint to update the order status (to be called after successful payment)
export async function updateOrderStatus(req, res) {
  const { orderId } = req.params;
  const { status } = req.body; // The new status (Packaging, Shipped, Completed)

  const validStatuses = ["Pending", "Packaging", "Shipped", "Completed"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const updatedOrder = await db("orders")
      .where("id", orderId)
      .update({ status })
      .returning("*");

    if (updatedOrder.length === 0) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json({ message: "Order status updated", order: updatedOrder[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error updating order status" });
  }
}
