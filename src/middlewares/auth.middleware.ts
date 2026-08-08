import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import ApiKey from "../models/apiKey.model";
import User, { UserDocument } from "../models/user.model";
import { extractApiKey, hashApiKey } from "../utils/apiKeys";
import { GOOGLE_CLIENT_ID, TEST_MODE } from "../utils/secrets";

let checkAuthTmp;

/** Avoid a database write on every authenticated request. */
const LAST_USED_THROTTLE_MS = 60 * 60 * 1000;

/**
 * Resolves a Polyglot API key to its owner, or null if the key is unknown,
 * revoked, expired, or its user no longer exists.
 */
async function authenticateApiKey(token: string): Promise<UserDocument | null> {
  const record = await ApiKey.findOne({ hash: hashApiKey(token) });
  if (!record) return null;

  if (record.revokedAt) return null;
  if (record.expiresAt && record.expiresAt.getTime() <= Date.now()) return null;

  const user = await User.findById(record.user);
  if (!user) return null;

  const lastUsed = record.lastUsedAt?.getTime() ?? 0;
  if (Date.now() - lastUsed > LAST_USED_THROTTLE_MS) {
    record.lastUsedAt = new Date();
    await record.save();
  }

  return user;
}

if (TEST_MODE) {
  checkAuthTmp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.user = (await User.findOne({ username: "guest" })) ?? undefined;
      req.authMethod = "test";
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
      // A Polyglot API key takes precedence when present: it is unambiguous
      // (recognised by its `pgk_` prefix) and cheaper to verify than a JWT.
      const apiKey = extractApiKey(req);
      if (apiKey) {
        const user = await authenticateApiKey(apiKey);
        if (!user)
          return res
            .status(401)
            .json({ error: "Invalid, revoked or expired API key" });

        req.user = user;
        req.authMethod = "apikey";
        return next();
      }

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
      req.authMethod = "google";
      next();
    } catch (error) {
      return res.status(401).json({ error: "Invalid token" });
    }
  };
}

export const checkAuth = checkAuthTmp;

/**
 * Blocks requests that authenticated with an API key.
 *
 * Used on the key-management routes so a leaked key cannot mint replacements for
 * itself — which is what makes revocation meaningful. Managing keys requires
 * proving identity to Google, i.e. signing in through the editor.
 *
 * Must be placed after `checkAuth`, which sets `req.authMethod`.
 */
export function denyApiKeyAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (req.authMethod === "apikey") {
    return res.status(403).json({
      error:
        "API keys cannot manage API keys. Sign in with Google to create or revoke a key.",
    });
  }
  return next();
}
