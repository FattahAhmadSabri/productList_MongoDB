const express = require("express")
const router = express.Router()
const {createProductController, getAllProductController}= require("../controller/productController")



router.post("/product",createProductController);
router.get("/product",getAllProductController)

module.exports =router