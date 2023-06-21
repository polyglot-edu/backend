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

export const CORS_ORIGINS = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : "*";

export const AUTH0_ISSUER_BASE_URL = process.env.ISSUER_BASE_URL as string;

export const AUTH0_AUDIENCE = process.env.AUDIENCE as string;

export const OPENAI_SECRET_KEY = process.env.OPENAI_SECRET_KEY as string;
export const OPENAI_ENDPOINT = process.env.OPENAI_ENDPOINT as string;

export const TEST_MODE = process.env.TEST_MODE === "true";


// Env check
if (!MONGODB_URI) throw new Error("MONGODB_URI env not defined!");

if (!OPENAI_SECRET_KEY) throw new Error("OPENAI_SECRET_KEY env not defined!");

if (!OPENAI_ENDPOINT) throw new Error("OPENAI_ENDPOINT env not defined!");

if (!TEST_MODE) {
    if(!AUTH0_ISSUER_BASE_URL) throw new Error("ISSUER_BASE_URL env not defined!");

    if(!AUTH0_AUDIENCE) throw new Error("AUDIENCE env not defined!");
}

// Env rielaboration
if (MONGODB_CERTIFICATE) {
    fs.writeFileSync(`/tmp/certificate.pem`, MONGODB_CERTIFICATE)
}