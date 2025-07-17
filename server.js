const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
const User = require('./models/User'); // Import User model

const app = express();
dotenv.config();

const PORT = process.env.PORT || 3000;
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ DB Connected"))
.catch(err => console.error("❌ DB Error:", err));

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html on root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
app.get('/add-test-user', async (req, res) => {
  try {
    const testUser = new User({
      email: "admin@example.com",
      password: "admin123"
    });
    await testUser.save();
    res.send("✅ logged in succesfully");
  } catch (err) {
    res.status(500).send("❌ Failed to add test user: " + err.message);
  }
});
// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
