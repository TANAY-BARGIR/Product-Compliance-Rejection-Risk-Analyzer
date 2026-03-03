const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./config/db'); // Init DB Pool

const app = express();
app.use(express.json()); // Allow parsing JSON bodies
app.use(cors());

// Import Routes
const apiRoutes = require('./routes/apiRoutes');
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Compliance Server running on port ${PORT}`);
});
