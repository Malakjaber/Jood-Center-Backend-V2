const express = require("express");
const router = express.Router();
const {
  getTreatments,
  createTreatmentPlan,
  getStudentTreatmentPlans,
} = require("../controllers/treatmentsController");

router.get("/", getTreatments);

router.post("/", async (req, res) => {
  const { content, date, class_id, teacher_id } = req.body;
  const result = await createTreatmentPlan(content, date, class_id, teacher_id);
  if (result.error) {
    res.status(400).json({ message: result.message });
  } else {
    res.status(200).json(result);
  }
});

router.get("/student-treatments", getStudentTreatmentPlans);

module.exports = router;
