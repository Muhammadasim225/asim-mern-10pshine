// routes/facebookAuth.js
const express = require('express');
const passport = require('passport');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { protectedRoutes } = require('../middlewares/protectedRoutes');
const logger = require('../logs/logging');

router.get('/facebook', passport.authenticate("facebook", { 
  scope: ["email", "public_profile"] 
}));

router.get("/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  (req, res) => {
    try {
      // ✅ FIX: Use email_address instead of email
      const token = jwt.sign(
        { 
          id: req.user.id, 
          email_address: req.user.email_address, // YEH CHANGE KARO
          avatar: req.user?.avatar, 
          full_name: req.user.full_name 
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '1h' }
      );

      logger.info(
        {
          action: 'facebook_oauth_success',
          userId: req.user.id,
          email: req.user.email_address, // YEH BHI CHANGE KARO
        },
        'Facebook OAuth successful, JWT generated'
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000 
      });

      res.redirect(`${process.env.CLIENT_URL}`);

    } catch (err) {
      logger.error(
        {
          action: 'facebook_oauth_error',
          error: err.message,
          stack: err.stack,
        },
        'Error during Facebook OAuth callback'
      );
      return res.redirect(`${process.env.CLIENT_URL}/login?error=facebook_failed`);
    }
  }
);

router.get('/me', protectedRoutes, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;