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


// Env check
if (!MONGODB_URI) throw new Error("MONGODB_URI env not defined!");

// Env rielaboration
if (MONGODB_CERTIFICATE) {
    fs.writeFileSync(`/tmp/certificate.pem`, MONGODB_CERTIFICATE)
}