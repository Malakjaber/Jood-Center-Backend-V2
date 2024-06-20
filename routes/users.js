const express = require("express");
const {
  getAllUsers,
  getUserById,
} = require("../controllers/usersController.js");
const { authenticate, authorize } = require("../middlewares/auth.js");

const router = express.Router();

router.get("/", authenticate, authorize(["manager"]), getAllUsers); // Example: Only admin and manager can get all users
router.get("/:id", authenticate, getUserById); // Example: Any authenticated user can get user by ID

module.exports = router;
