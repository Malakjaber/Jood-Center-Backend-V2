const express = require("express");
const router = express.Router();
const {
  getReports,
  createReport,
} = require("../controllers/reportsController");
const { authenticate, authorize } = require("../middlewares/auth");

// Apply authentication and authorization middleware to routes
router.get("/", authenticate, getReports);

router.post(
  "/",
  authenticate,
  authorize(["manager", "teacher"]),
  async (req, res) => {
    const { content, date, st_id, teacher_id } = req.body;
    const result = await createReport(content, date, st_id, teacher_id);
    if (result.error) {
      res.status(400).json({ message: result.message });
    } else {
      res.status(200).json(result);
    }
  }
);

module.exports = router;
