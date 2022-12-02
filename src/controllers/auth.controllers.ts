import { CookieOptions, NextFunction, Request, Response } from "express";
import passport from "passport";
import { EXP_ACCESSJWT } from "../config/auth";
import { generateJwt, handleRedirectUrl } from "../utils/auth";
import { extractURLDomain } from "../utils/general";
import { CORS_ORIGINS } from "../utils/secrets";

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  req.session.returnUrl = handleRedirectUrl(req.query.returnUrl?.toString(), req.headers.referer);
  next();
}

export const logoutJWT = async (req: Request,res: Response, next: NextFunction) => {
  var redirectUrl = handleRedirectUrl(req.query.returnUrl?.toString(), req.headers.referer);
  const cookie_opts: CookieOptions = {expires: new Date(0)};

  if (process.env.NODE_ENV === 'production') {
    cookie_opts.domain = extractURLDomain(CORS_ORIGINS[0]);
    cookie_opts.secure = true;
  }

  res.cookie('x-auth-cookie', "", cookie_opts);
  res.redirect(redirectUrl);

}

export const googleCallback = async (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("google", (err, user, info) => {
    // This is the default destination upon successful login.
    var redirectUrl = CORS_ORIGINS[0];

    if (err) { return next(err); }
    if (!user) { return res.redirect(redirectUrl); }

    // check if a custom redirect is set in session
    if (req.session.returnUrl) {
      redirectUrl = req.session.returnUrl;
      req.session.returnUrl = "";
    }

    // Set up cookies
    let date = new Date();
    date.setTime(date.getTime() + EXP_ACCESSJWT * 1000);
    const cookie_opts: CookieOptions = {expires: date};

    if (process.env.NODE_ENV === 'production') {
      cookie_opts.domain = extractURLDomain(redirectUrl);
      cookie_opts.secure = true;
    }

    // generate access token
    const token = generateJwt(user.toJSON());

    res.cookie('x-auth-cookie', token, cookie_opts);
    res.redirect(redirectUrl);

  })(req, res, next);
}