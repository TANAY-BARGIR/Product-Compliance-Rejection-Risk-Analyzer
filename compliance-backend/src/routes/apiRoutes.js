const express = require("express");
const router = express.Router();
const {
  evaluateProduct,
  getProductReport,
  getEvaluationHistory,
} = require("../controllers/evaluateController");

router.post("/evaluate", evaluateProduct);
router.post("/report", getProductReport);
router.get("/history", getEvaluationHistory);

module.exports = router;