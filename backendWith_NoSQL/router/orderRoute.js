const { createOrderController } = require("../controller/orderController");
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/jwtTokenMiddleware");
router.post("/order",authMiddleware, createOrderController);

module.exports = router;
