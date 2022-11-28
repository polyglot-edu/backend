import passport from "passport";
import passportGoogle from "passport-google-oauth20";
import passportJWT from 'passport-jwt';

import User from "../models/user.model";
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, COOKIE_KEY } from "../utils/secrets";

const GoogleStrategy = passportGoogle.Strategy;
const JWTStrategy = passportJWT.Strategy;

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try{
        const user = await User.findOne({ googleId: profile.id });

        // If user doesn't exist creates a new user
        if (!user) {
          const newUser = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails?.[0].value,
          });
          if (newUser) {
            done(null,newUser);
          }
        } else {
          done(null, user);
        }
      }catch (err) {
        done(err as Error);
      }
    }
  )
);

// setup JWT passport strategy
passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: (req) => {
        let token = null;
        if (req && req.headers?.authorization) {
          token = req.headers.authorization;
        }
        return token;
      },
      secretOrKey: COOKIE_KEY,
    },
    (jwtPayload, done) => {
      if (!jwtPayload) {
        return done('No token found...');
      }
      return done(null, jwtPayload);
    }
  )
);
  
