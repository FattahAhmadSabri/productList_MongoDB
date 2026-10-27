const Order = require("../model/orderSchema");
const Cart = require("../model/cartSchema");

const createOrderService = async (userId) => {
  const cartItems = await Cart.find({ userId: userId });

  if (cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const orders = await Order.insertMany(
    cartItems.map((item) => ({
      userId,
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    })),
  );

  await Cart.deleteMany({ userId: userId });

  return orders;
};

module.exports = { createOrderService };
