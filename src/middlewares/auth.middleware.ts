import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model";
import { GOOGLE_CLIENT_ID, TEST_MODE } from "../utils/secrets";

let checkAuthTmp;

if (TEST_MODE) {
  checkAuthTmp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.user = (await User.findOne({ username: "guest" })) ?? undefined;
      next();
    } catch (err) {
      next(err);
    }
  };
} else {
  // Verifies Google ID tokens. The client caches Google's JWKS internally and
  // checks signature, issuer, audience and expiry as part of verifyIdToken.
  const client = new OAuth2Client();

  // GOOGLE_CLIENT_ID may hold several comma-separated ids so that a second
  // client (e.g. a native one) can be accepted without a code change.
  const audience = GOOGLE_CLIENT_ID.split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  checkAuthTmp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
      if (!token)
        return res.status(401).json({ error: "Missing bearer token" });

      const ticket = await client.verifyIdToken({ idToken: token, audience });
      const payload = ticket.getPayload();
      if (!payload?.sub)
        return res.status(401).json({ error: "Invalid token" });

      let user = await User.findOne({ googleId: payload.sub });

      // Username is only set on create: existing users keep the name they
      // already have rather than being renamed from their Google profile.
      if (!user) {
        user = await User.create({
          googleId: payload.sub,
          email: payload.email,
          username: payload.name ?? payload.email,
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

export const checkAuth = checkAuthTmp;
