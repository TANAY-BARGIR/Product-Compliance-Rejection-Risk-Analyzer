const express = require("express");
const router = express.Router();
const {
  evaluateProduct,
  getProductReport,
  getEvaluationHistory,
  getEvaluationDetail,
} = require("../controllers/evaluateController");

router.post("/evaluate", evaluateProduct);
router.post("/report", getProductReport);
router.get("/history", getEvaluationHistory);
router.get("/evaluations/:id", getEvaluationDetail);

module.exports = router;