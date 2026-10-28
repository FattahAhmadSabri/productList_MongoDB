const express = require("express");
const {
  createUserController,
  getUserbyIdController,
  getAllUserController,
  updateUserController,
  deleteUserController,
  loginController,
} = require("../controller/userController");
const authMiddleware = require("../middleware/jwtTokenMiddleware");

const router = express.Router();

router.post("/user", createUserController);
router.post("/login", loginController);
router.get("/user/:id",authMiddleware, getUserbyIdController);
router.get("/user", getAllUserController);
router.patch("/user/:id",authMiddleware, updateUserController);
router.delete("/user/:id",authMiddleware, deleteUserController);

module.exports = router;
