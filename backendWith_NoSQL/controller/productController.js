const {
  createProductService,
  getAllProductService,
  deleteProductService,
  updateProductService,
} = require("../service/productService");
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseMiddleware");
const createProductController = async (req, res) => {
  try {
    const { title, price, description, imageUrl } = req.body;
    const response = await createProductService(
      title,
      price,
      description,
      imageUrl,
    );
    successResponse(res, (message = "Success"), response, (statusCode = 201));
  } catch (error) {
    errorResponse(res, (message = error.message), (statusCode = 500));
  }
};

const getAllProductController = async (req, res) => {
  try {
    const response = await getAllProductService();
    successResponse(res, (message = "Success"), response, (statusCode = 200));
  } catch (error) {
    errorResponse(res, (message = error.message), (statusCode = 500));
  }
};

const UpdateProductController = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, price, description } = req.body;
    const response = await updateProductService(id, title, price, description);
    successResponse(res, (message = "Success"), response, (statusCode = 200));
  } catch (error) {
    errorResponse(res, (message = error.message), (statusCode = 500));
  }
};

const deleteProductController = async (req,res)=>{
      try {
            const id = req.params.id
      const response = await  deleteProductService(id)
      successResponse(res, (message = "Success"), response, (statusCode = 200));
      } catch (error) {
          errorResponse(res, (message = error.message), (statusCode = 500));  
      }
}

module.exports = { createProductController, getAllProductController, UpdateProductController, deleteProductController };
