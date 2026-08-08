import crypto from "crypto";
import { Request } from "express";

/**
 * Polyglot-issued API keys.
 *
 * Format: `pgk_` + 32 random bytes, base64url. The prefix makes a key
 * recognisable in logs and lets the auth middleware tell it apart from a Google
 * ID token without parsing either.
 *
 * Only the SHA-256 hash is stored. Lookup is by hash, so the database index does
 * the comparison and the plaintext never has to be held or compared in the
 * application. SHA-256 is the right choice here rather than bcrypt/argon2: the
 * token is 256 bits of uniform randomness, not a low-entropy password, so key
 * stretching buys nothing and would add latency to every authenticated request.
 */

export const API_KEY_PREFIX = "pgk_";

/** Characters of the key kept in clear, so a user can identify it in a list. */
const DISPLAY_CHARS = 6;

export function hashApiKey(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateApiKey(): {
  token: string;
  hash: string;
  display: string;
} {
  const token = API_KEY_PREFIX + crypto.randomBytes(32).toString("base64url");
  return {
    token,
    hash: hashApiKey(token),
    display: token.slice(0, API_KEY_PREFIX.length + DISPLAY_CHARS) + "…",
  };
}

/**
 * Pulls an API key from the request, accepting either transport:
 *
 *   x-api-key: pgk_...
 *   Authorization: Bearer pgk_...
 *
 * The second form exists so generic HTTP clients, and Swagger UI's Authorize
 * button, work without a custom header. Returns undefined when the request
 * carries no API key, in which case the caller falls back to Google ID tokens.
 */
export function extractApiKey(req: Request): string | undefined {
  const header = req.headers["x-api-key"];
  if (typeof header === "string" && header.startsWith(API_KEY_PREFIX)) {
    return header;
  }

  const bearer = req.headers.authorization?.match(/^Bearer (.+)$/)?.[1];
  if (bearer?.startsWith(API_KEY_PREFIX)) return bearer;

  return undefined;
}
