const { createOrderService } = require("../service/orderService");

const {
  successResponse,
  errorResponse,
} = require("../middleware/responseMiddleware");

const createOrderController = async (req, res) => {
  try {
    const userId = req.user.id;

    const response = await createOrderService(userId);

    return successResponse(res, "Order created successfully", response, 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = { createOrderController };
