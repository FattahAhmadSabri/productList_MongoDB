const Cart = require("../model/cartSchema");
const Product = require("../model/productSchema");

const addCartService = async (userId, productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const existingItem = await Cart.findOne({
    userId,
    productId,
  });

  if (existingItem) {
    existingItem.quantity += 1;
    await existingItem.save();
    return existingItem;
  }

  const cart = await Cart.create({
    userId,
    productId,
    quantity: 1,
    price: product.price,
  });

  return cart;
};

const getCartItemsService = async (userId) => {
  const response = await Cart.find({ userId: userId }).populate("productId");

  return response;
};

const updateCartQuantityService = async (userId, productId, action) => {
  const quantityChange = action === "increase" ? 1 : -1;

  const cartItem = await Cart.findOne({
    userId,
    productId,
  });

  if (!cartItem) {
    throw new Error("Product not found in cart");
  }

  if (action === "decrease" && cartItem.quantity === 1) {
    throw new Error("Quantity cannot be less than 1");
  }

  const updatedItem = await Cart.findOneAndUpdate(
    { userId, productId },
    { $inc: { quantity: quantityChange } },
    { new: true, runValidators: true },
  );

  return updatedItem;
};

const removeProductFromCart = (userId, productId) => {
  const response = Cart.findOneAndDelete({
    userId: userId,
    productId: productId,
  });
  return response;
};

module.exports = {
  addCartService,
  updateCartQuantityService,
  getCartItemsService,
  removeProductFromCart,
};
