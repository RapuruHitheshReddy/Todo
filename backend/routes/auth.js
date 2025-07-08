const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');

// 🔐 Register new user
router.post('/register', authController.register);

// 🔑 Login using Passport Local Strategy
router.post(
  '/login',
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: 'Invalid credentials' });

      req.logIn(user, (err) => {
        if (err) return next(err);
        return authController.login(req, res);
      });
    })(req, res, next);
  }
);

// 🚪 Logout
router.post('/logout', authController.logout);

// 👤 Get current logged-in user
router.get('/me', authController.getCurrentUser);

// 🐞 Optional: Debug session (only for dev)
router.get('/debug-session', (req, res) => {
  res.json({
    session: req.session,
    user: req.user,
    authenticated: req.isAuthenticated(),
  });
});

module.exports = router;
