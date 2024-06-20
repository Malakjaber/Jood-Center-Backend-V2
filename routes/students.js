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

// Apply authentication and authorization middleware to routes
router.get("/", authenticate, getAllStudents); // Example: Any authenticated user can get all students
router.get("/:id", authenticate, getStudentById); // Example: Any authenticated user can get a student by ID

router.post("/", authenticate, authorize(["admin", "teacher"]), addNewStudent); // Example: Only admin and teacher can add a new student
router.put("/:id", authenticate, authorize(["admin", "teacher"]), editStudent); // Example: Only admin and teacher can edit a student
router.delete("/:id", authenticate, authorize(["admin"]), removeStudent); // Example: Only admin can remove a student

router.get(
  "/teacher/:teacherId",
  authenticate,
  authorize(["admin", "teacher"]),
  getStudentsByTeacher
); // Example: Only admin and teacher can get students by teacher

module.exports = router;
