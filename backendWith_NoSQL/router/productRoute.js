const express = require("express");
const router = express.Router();
const {
  createProductController,
  getAllProductController,
  UpdateProductController,
  deleteProductController,
} = require("../controller/productController");

router.post("/product", createProductController);
router.get("/product", getAllProductController);
router.delete("/product/:id", deleteProductController);
router.patch("/product/:id", UpdateProductController);

module.exports = router;
