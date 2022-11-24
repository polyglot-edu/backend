import dotenv from "dotenv";


dotenv.config();

export const ENV = process.env.NODE_ENV || "development";

export const PORT = (process.env.PORT || 5000) as number;

export const MONGO_URL = (process.env.MONGODB_URI || 'mongodb://prova:SECRET@localhost:27017') as string

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID as string;

export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET as string;

export const COOKIE_KEY = process.env.COOKIE_KEY as string;

export const CORS_ORIGINS = process.env.CORS_ORIGINS?.split(',') as string[]