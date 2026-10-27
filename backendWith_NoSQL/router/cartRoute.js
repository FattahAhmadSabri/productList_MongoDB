const express = require("express");
const {
  addCartController,
  updateCartController,
  getCartItemsController,
  removeProductFromCartController,
} = require("../controller/cartController");
const authMiddleware = require("../middleware/jwtTokenMiddleware");
const router = express.Router();

router.post("/cart", authMiddleware, addCartController);
router.get("/cart", authMiddleware, getCartItemsController);
router.patch("/cart/:productId", authMiddleware, updateCartController);
router.delete(
  "/cartproduct/:productId",
  authMiddleware,
  removeProductFromCartController,
);

module.exports = router;
