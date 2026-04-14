const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");
const { isAdminEmail } = require("../utils/adminEmails");

const makeCode = (name, email) => {
  const namePart = (name || "USER").replace(/[^A-Za-z]/g, "").toUpperCase().slice(0, 4);
  const emailPart = (email || "").split("@")[0].replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 3);
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${namePart}${emailPart}${randomPart}`;
};

const generateUniqueReferralCode = async (name, email) => {
  for (let i = 0; i < 8; i += 1) {
    const candidate = makeCode(name, email);
    const exists = await User.findOne({ referralCode: candidate }).select("_id");
    if (!exists) return candidate;
  }
  return `LM${Date.now().toString(36).toUpperCase()}`;
};

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
          }
          if (!existingUser.referralCode) {
            existingUser.referralCode = await generateUniqueReferralCode(
              existingUser.fullName,
              existingUser.email
            );
          }
          if (existingUser.isModified()) {
            await existingUser.save();
          }
          return done(null, existingUser);
        }

        const email = profile.emails[0].value;
        const referralCode = await generateUniqueReferralCode(
          profile.displayName,
          email
        );
        const newUser = await User.create({
          googleId: profile.id,
          fullName: profile.displayName,
          email,
          profilePicture: profile.photos?.[0]?.value || "",
          role: isAdminEmail(email) ? "admin" : "user",
          referralCode,
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