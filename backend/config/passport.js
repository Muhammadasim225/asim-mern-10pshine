const passport=require('passport');
const db=require('./database')
const GoogleStrategy=require('passport-google-oauth20').Strategy
const User=db.user;
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },

  async (accessToken, refreshToken, profile, cb)=>{
    try{
        let user = await User.findOne({   where: { googleId: profile.id }
        });

        if (!user) {
          user = await User.create({
            googleId: profile.id,
            full_name: profile.displayName,
            email_address: profile.emails[0].value,
            avatar: profile.photos[0].value
          });
        }
        return cb(null, user);

    }
    catch(err){
        return cb(err,null)

    }
  
  }
));