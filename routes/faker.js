const { fillDb } = require("../utils/fakerRoutes.js");
const express = require("express");

const router = express.Router();

router.post("/", fillDb);

module.exports = router;
