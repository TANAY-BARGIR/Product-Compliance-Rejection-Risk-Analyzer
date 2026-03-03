const express = require('express');
const router = express.Router();
const { evaluateProduct, getProductReport } = require('../controllers/evaluateController'); // Import new method

router.post('/evaluate', evaluateProduct);
router.post('/report', getProductReport); // <--- New Route

module.exports = router;