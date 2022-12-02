import express from 'express';
import { query } from 'express-validator';
import passport from 'passport';
import * as AuthController from '../controllers/auth.controllers';

const router = express.Router();

router.get('/logout', AuthController.logoutJWT)

router.get(
  "/google",
  AuthController.googleLogin,
  passport.authenticate('google', { scope: ["email", "profile"]})
)

router.get("/google/callback", AuthController.googleCallback)


export default router;