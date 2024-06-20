const express = require("express");
const router = express.Router();
const {
  getAllClasses,
  getClassById,
  addNewClass,
  getClassesInformation,
  removeClass,
  editClass,
} = require("../controllers/classesController");
const { authenticate, authorize } = require("../middlewares/auth");

router.get("/", authenticate, getAllClasses);
router.get("/details", authenticate, getClassesInformation);
router.get("/:id", authenticate, getClassById);

router.post("/", authenticate, authorize(["manager"]), addNewClass);
router.put("/:id", authenticate, authorize(["manager"]), editClass);
router.delete("/:id", authenticate, authorize(["manager"]), removeClass);

module.exports = router;
