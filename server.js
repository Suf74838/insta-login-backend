const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// DB Connection
require('dotenv').config();
mongoose.connect(process.env.MANGO_URI)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.error("DB Error:", err));

// Middleware
app.use(express.json());

// Serve static files (your login page)
app.use(express.static(path.join(__dirname, 'public')));

// Optional route to serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Your /login POST route
app.post('/login', async (req, res) => {
  // login logic...
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
