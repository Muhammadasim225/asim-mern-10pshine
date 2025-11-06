const passport=require('passport');
const db=require('./database')
const GoogleStrategy=require('passport-google-oauth20').Strategy
const FacebookStrategy=require('passport-facebook').Strategy
const User=db.user;

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `http://localhost:5000/auth/google/callback`
},
async (accessToken, refreshToken, profile, cb) => {
  try {
    // Try to find user by googleId first
    let user = await User.findOne({ where: { googleId: profile.id } });

    // If user not found by googleId, try email_address
    if (!user && profile.emails?.[0]?.value) {
      user = await User.findOne({ where: { email_address: profile.emails[0].value } });
    }

    // If user exists, update googleId if not set
    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await user.save();
      }
      return cb(null, user);
    }

    // If no user found, create new user
    user = await User.create({
      googleId: profile.id,
      full_name: profile.displayName,
      email_address: profile.emails?.[0]?.value || null,
      avatar: profile.photos?.[0]?.value || null
    });

    return cb(null, user);

  } catch (err) {
    return cb(err, null);
  }
}
));


// config/passport.js - Facebook Strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `http://localhost:5000/auth/facebook/callback`,
  profileFields: ['id', 'displayName', 'photos', 'email']
},
async function(accessToken, refreshToken, profile, cb) {
  try {
    let user = await User.findOne({ where: { facebookId: profile.id } });

    if (!user && profile.emails?.[0]?.value) {
      user = await User.findOne({ where: { email_address: profile.emails[0].value } });
    }

    if (user) {
      if (!user.facebookId) {
        user.facebookId = profile.id;
        await user.save();
      }
      return cb(null, user);
    }

    user = await User.create({
      facebookId: profile.id,
      full_name: profile.displayName,
      email_address: profile.emails?.[0]?.value || `fb_${profile.id}@facebook.com`,
      avatar: profile.photos?.[0]?.value || null
    });

    return cb(null, user);

  } catch (err) {
    return cb(err, null);
  }
}));
