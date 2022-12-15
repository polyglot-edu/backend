import dotenv from "dotenv";
import fs from 'fs';


dotenv.config();

// Env definition
export const ENV = (process.env.DOMAIN_APP_DEPLOY ? "production" : (process.env.NODE_ENV || "development"));

export const PORT = process.env.PORT ? +process.env.PORT : 5000;

export const DOMAIN_APP_DEPLOY = process.env.DOMAIN_APP_DEPLOY || ("localhost:" + PORT)

const MONGODB_URI = process.env.MONGODB_URI;

const MONGODB_CERTIFICATE = process.env.MONGODB_CERTIFICATE;

export const MONGO_URL = MONGODB_URI + (MONGODB_CERTIFICATE ? encodeURIComponent(`/tmp/certificate.pem`) : "");

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;

export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

export const COOKIE_KEY = process.env.COOKIE_KEY as string;

export const CORS_ORIGINS = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : "*";


// Env check
if (!MONGODB_URI) throw new Error("MONGODB_URI env not defined!");

if (!GOOGLE_CLIENT_ID) throw new Error("GOOGLE_CLIENT_ID env not defined!");

if (!GOOGLE_CLIENT_SECRET) throw new Error("GOOGLE_CLIENT_SECRET env not defined!");

if (!COOKIE_KEY) throw new Error("COOKIE_KEY env not defined!");

// Env rielaboration
if (MONGODB_CERTIFICATE) {
    fs.writeFileSync(`/tmp/certificate.pem`, MONGODB_CERTIFICATE)
}