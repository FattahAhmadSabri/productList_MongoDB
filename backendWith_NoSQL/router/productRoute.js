const express = require("express")

const {createProductController, getAllProductController}= require("../controller/productController")

const router = express.Router()

router.post("/product",createProductController);
router.get("/product",getAllProductController)

module.exports =router