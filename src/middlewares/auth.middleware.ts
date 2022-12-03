import { Request, Response, NextFunction } from "express";
import passport from "passport";

export const checkAuthJWT = passport.authenticate('jwt', {session: false});

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) return next();
  res.status(401).send();
}