const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// Model
const User = require('./models/User');

// ✅ REGISTER route — put this BEFORE app.listen
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const newUser = new User({ email, password });
    await newUser.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});

// ✅ LOGIN route with auto-registration
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      // Auto-register new user if not found
      user = new User({ email, password });
      await user.save();
      return res.json({ message: 'User auto-registered and logged in', user });
    }

    // Check password
    if (user.password === password) {
      return res.json({ message: 'Login successful', user });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
app.get('/', (req, res) => {
  res.send('✅ Backend is running!');
});

app.listen(5000, () => {
  console.log("Server started on http://localhost:5000");
});
