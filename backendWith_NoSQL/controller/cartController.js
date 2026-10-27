const {
  addCartService,
  updateCartQuantityService,
  getCartItemsService,
  removeProductFromCart,
} = require("../service/cartService");
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseMiddleware");
const addCartController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    const response = await addCartService(userId, productId);

    return successResponse(res, "Success", response, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const getCartItemsController = async (req, res) => {
  try {
    const userId = req.user.id;
    const response = await getCartItemsService(userId);
    return successResponse(res, "Success", response, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const updateCartController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const {action} =req.body

    const response = await updateCartQuantityService(userId, productId, action);

    return successResponse(res, "Product removed from cart", response, 200);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const removeProductFromCartController = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;
    
    if (!productId) {
      return errorResponse(res, "Product ID is required", 400);
    }

    const response = await removeProductFromCart(userId, productId);
  
    return successResponse(res, "Product removed from cart", response, 200);
  } catch (error) {
    const statusCode = error.message === "Product does not exist" ? 404 : 500;
    return errorResponse(res, error.message, statusCode);
  }
};

module.exports = {
  addCartController,
  updateCartController,
  getCartItemsController,
  removeProductFromCartController,
};
