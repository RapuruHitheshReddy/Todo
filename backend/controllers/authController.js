const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    return res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = (req, res) => {
  console.log('✅ Login Success - Session:', req.session);
  return res.status(200).json({ message: 'Login successful', user: req.user });
};

exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: 'Logout error' });
    res.clearCookie('todoSession'); // Match the session name from server.js
    return res.status(200).json({ message: 'Logged out successfully' });
  });
};

exports.getCurrentUser = (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, name, email } = req.user;
    return res.status(200).json({ user: { _id, name, email } });
  }
  return res.status(401).json({ message: 'Not authenticated' });
};
