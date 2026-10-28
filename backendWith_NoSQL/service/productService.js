const Product = require("../model/productSchema");

const createProductService = (title, price, description, imageUrl) => {
  const product = new Product({ title, price, description, imageUrl });
  return product.save();
};

const getAllProductService = () => {
  const response = Product.find();
  return response;
};

const deleteProductService = async (id) => {
  const item = await Product.findByIdAndDelete(id);

  if (!item) {
    throw new Error("Product is not available");
  }

  return item;
};

const updateProductService = async (id, title, price, description) => {
  const item = await Product.findByIdAndUpdate(
    id,
    { title, price, description },
    { new: true, runValidators: true },
  );

  if (!item) {
    throw new Error("Product is not available");
  }

  return item;
};

module.exports = {
  createProductService,
  getAllProductService,
  deleteProductService,
  updateProductService,
};
