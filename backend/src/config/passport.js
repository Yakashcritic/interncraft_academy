const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { isAdminEmail } = require("../utils/adminEmails");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await User.findOne({ email: profile.emails[0].value });

        if (existingUser) {
          if (isAdminEmail(existingUser.email) && existingUser.role !== "admin") {
            existingUser.role = "admin";
            await existingUser.save();
          }
          return done(null, existingUser);
        }

        const email = profile.emails[0].value;
        const newUser = await User.create({
          googleId: profile.id,
          fullName: profile.displayName,
          email,
          profilePicture: profile.photos?.[0]?.value || "",
          role: isAdminEmail(email) ? "admin" : "user",
        });

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (user && isAdminEmail(user.email) && user.role !== "admin") {
      user.role = "admin";
      await user.save();
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;