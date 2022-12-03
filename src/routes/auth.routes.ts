import express from 'express';
import passport from 'passport';
import * as AuthController from '../controllers/auth.controllers';

const router = express.Router();

router.get('/logout', AuthController.logout)

router.get(
  "/google",
  AuthController.googleLogin,
  passport.authenticate('google', { scope: ["email", "profile"]})
)

router.get("/google/callback", AuthController.googleCallback)


export default router;