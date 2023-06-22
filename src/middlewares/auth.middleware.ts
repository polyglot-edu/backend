import { Request, Response, NextFunction } from "express";
import {expressjwt as jwt} from 'express-jwt';
import jwks from 'jwks-rsa';
import User from "../models/user.model";
import { AUTH0_AUDIENCE, AUTH0_ISSUER_BASE_URL, TEST_MODE } from "../utils/secrets";

let checkAuthTmp;

if (TEST_MODE) {
  checkAuthTmp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.user = await User.findOne({username: "guest"}) ?? undefined;
      next();
    } catch(err) {
      next(err);
    }
    
  }
} else {
  checkAuthTmp = [
    jwt({
      secret: jwks.expressJwtSecret({
            cache: true,
            rateLimit: true,
            jwksRequestsPerMinute: 5,
            jwksUri: AUTH0_ISSUER_BASE_URL + '.well-known/jwks.json'
      }) as any,
      audience: AUTH0_AUDIENCE,
      issuer: AUTH0_ISSUER_BASE_URL,
      algorithms: ['RS256']
    }),
    async (req: Request, res: Response, next: NextFunction) => {
      try{
        const sub = req?.auth?.sub;
        const username = req?.auth?.["https://polyglot-edu.com/username"];
        if (!sub) return res.status(400).json({"error": "Bad request!"});
  
        let query;  
        switch (sub.split('|')[0]) {
        case 'google-oauth2':
          query = { googleId: sub.split('|')[1] };
          break;
        default:
          return res.status(400).json({"error": "Invalid user auth"});
        }
  
        let user = await User.findOne(query);
  
        if (!user) {
          user = await User.create({
            ...query,
            username: username
          });
        };
  
        if (user.username !== username) {
          user.username = username;
          await user.save();
        }
  
        req.user = user;
        next();
      } catch (error) {
        next(error);
      }
    }
  ]
}

export const checkAuth = checkAuthTmp;
