import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

// Env definition
export const ENV = process.env.DOMAIN_APP_DEPLOY
  ? "production"
  : process.env.NODE_ENV || "development";

export const PORT = process.env.PORT ? +process.env.PORT : 5000;

// Prometheus scrape port. Deliberately separate from PORT: the public
// hostname routes every path, so /metrics must not live on the app port.
export const METRICS_PORT = process.env.METRICS_PORT
  ? +process.env.METRICS_PORT
  : 9091;

export const DOMAIN_APP_DEPLOY =
  process.env.DOMAIN_APP_DEPLOY || "localhost:" + PORT;

const MONGODB_URI = process.env.MONGODB_URI;

const MONGODB_CERTIFICATE = process.env.MONGODB_CERTIFICATE;

export const MONGO_URL =
  MONGODB_URI +
  (MONGODB_CERTIFICATE ? encodeURIComponent(`/tmp/certificate.pem`) : "");

export const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : "*";

// Google OAuth client id used as the expected `aud` of incoming ID tokens.
// Accepts a comma-separated list so additional clients can be added later.
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;

export const OPENAI_SECRET_KEY = process.env.OPENAI_SECRET_KEY as string;
export const OPENAI_ENDPOINT = process.env.OPENAI_ENDPOINT as string;

export const TEST_MODE = process.env.TEST_MODE === "true";

// Gates the destructive `serverClean` maintenance routes. Optional: when unset
// those routes are disabled outright rather than falling back to a default.
export const MAINTENANCE_SECRET = process.env.MAINTENANCE_SECRET as string;

// Env check
if (!MONGODB_URI) throw new Error("MONGODB_URI env not defined!");

if (!OPENAI_SECRET_KEY) throw new Error("OPENAI_SECRET_KEY env not defined!");

if (!OPENAI_ENDPOINT) throw new Error("OPENAI_ENDPOINT env not defined!");

if (!TEST_MODE) {
  if (!GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID env not defined!");
}

// Env rielaboration
if (MONGODB_CERTIFICATE) {
  fs.writeFileSync(`/tmp/certificate.pem`, MONGODB_CERTIFICATE);
}
