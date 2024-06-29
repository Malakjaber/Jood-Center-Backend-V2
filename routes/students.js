const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  addNewStudent,
  removeStudent,
  getStudentsByTeacher,
  editStudent,
} = require("../controllers/studentsController");
const { authenticate, authorize } = require("../middlewares/auth");

router.get("/", authenticate, getAllStudents);
router.get("/:id", authenticate, getStudentById);

router.post(
  "/",
  authenticate,
  authorize(["manager", "co_manager"]),
  addNewStudent
);
router.put(
  "/:id",
  authenticate,
  authorize(["manager", "co_manager"]),
  editStudent
);
router.delete(
  "/:id",
  authenticate,
  authorize(["manager", "co_manager"]),
  removeStudent
);

router.get(
  "/teacher/:teacherId",
  authenticate,
  authorize(["manager", "teacher"]),
  getStudentsByTeacher
);

module.exports = router;
