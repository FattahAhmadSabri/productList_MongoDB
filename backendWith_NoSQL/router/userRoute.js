const express = require("express");
const {
  createUserController,
  getUserbyIdController,
  getAllUserController,
  updateUserController,
  deleteUserController,
  loginController,
} = require("../controller/userController");

const router = express.Router();

router.post("/user", createUserController);
router.post("/login", loginController);
router.get("/user/:id", getUserbyIdController);
router.get("/user", getAllUserController);
router.patch("/user/:id", updateUserController);
router.delete("/user/:id", deleteUserController);

module.exports = router;
