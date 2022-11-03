import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import passport from "passport";

// FIX: implementare deserializzatore per limitare l'output
export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return to the previous path if 
    return res.redirect("back");
  }
  req.session.returnUrl = req.query.returnUrl?.toString();
  next();
}

export const logout = async (req: Request,res: Response, next: NextFunction) => {
  req.logout(err => {
    if(err) return next(err);
    res.redirect("back");
  });
}

export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", (err, user, info) => {
    // This is the default destination upon successful login.
    var redirectUrl = 'back';

    if (err) { return next(err); }
    if (!user) { return res.redirect(redirectUrl); }

    if (req.session.returnUrl) {
      redirectUrl = req.session.returnUrl;
      req.session.returnUrl = "";
    }
    req.logIn(user, function(err){
      if (err) { return next(err); }
      res.redirect(redirectUrl);
    });
  })(req, res, next);
}