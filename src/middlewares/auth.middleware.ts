import passport from "passport";

export const checkAuth = passport.authenticate('jwt', {session: false});