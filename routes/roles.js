const express = require("express");
const router = express.Router();
const { getRoles } = require("../controllers/rolesController");
const { authenticate, authorize } = require("../middlewares/auth");

// Route to get all roles
router.get("/", authenticate, getRoles);

module.exports = router;
