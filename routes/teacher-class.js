const express = require("express");
const {
  getClassesByTeacherId,
} = require("../controllers/teacherClassController.js");
const { authenticate, authorize } = require("../middlewares/auth.js");

const router = express.Router();

// Apply authentication and authorization middleware to the route
router.get(
  "/:id",
  authenticate,
  authorize(["manager", "teacher"]),
  getClassesByTeacherId
);

module.exports = router;
