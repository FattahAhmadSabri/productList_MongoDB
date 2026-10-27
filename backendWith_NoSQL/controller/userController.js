const {
  createUserService,
  getUserByIdService,
  getAllUserService,
  updateUserService,
  deleteUserService,
  loginService,
} = require("../service/userService");
const jwt = require("jsonwebtoken")
const {
  successResponse,
  errorResponse,
} = require("../middleware/responseMiddleware");
const createUserController = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const response = await createUserService(name, email, mobile, password);
    successResponse(res, (message = "Success"), response, (statusCode = 201));
  } catch (error) {
    errorResponse(res, (message = error.message), (statusCode = 500));
  }
};

const updateUserController = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;
    const { id } = req.params;
    const response = await updateUserService(id, name, email, mobile, password);
    successResponse(res, (message = "Success"), response, (statusCode = 200));
  } catch (error) {
    errorResponse(res, (message = error.message), (statusCode = 500));
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await loginService(email, password);

    
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return successResponse(
      res,
      "Success",
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email
        }
      },
      200
    );
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

const deleteUserController = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await deleteUserService(id);
    successResponse(res, (message = "Success"), response, (statusCode = 200));
  } catch (error) {
    errorResponse(res, (message = error.message), (statusCode = 500));
  }
};

const getUserbyIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await getUserByIdService(id);
    successResponse(res, (message = "Success"), response, (statusCode = 200));
  } catch (error) {
    errorResponse(res, (message = error.message), (statusCode = 500));
  }
};

const getAllUserController = async (req, res) => {
  try {
    const response = await getAllUserService();
    successResponse(res, (message = "Success"), response, (statusCode = 200));
  } catch (error) {
    errorResponse(res, (message = error.message), (statusCode = 500));
  }
};

module.exports = {
  createUserController,
  getUserbyIdController,
  getAllUserController,
  updateUserController,
  deleteUserController,
  loginController
};
