const express = require("express");
const {
  getAllUsers,
  getUserById,
} = require("../controllers/usersController.js");
const { authenticate, authorize } = require("../middlewares/auth.js");

const router = express.Router();

router.get("/", authenticate, authorize(["manager"]), getAllUsers);
router.get("/:id", authenticate, getUserById);

module.exports = router;
