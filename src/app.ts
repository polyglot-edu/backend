import express from 'express';
import bodyParser from "body-parser";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import router from "./routes";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware";
import "./config/passport"; // DON'T REMOVE
import session, { SessionOptions } from 'express-session';
import MongoStore from 'connect-mongo';
import { COOKIE_KEY, CORS_ORIGINS, ENV, MONGO_URL } from "./utils/secrets";
import passport from 'passport';

/*
    STRUCTURE
    │   app.js          # App entry point
    └───routes          # Our routes controllers for all the endpoints of the app
    └───config          # Environment variables and configuration related stuff
    └───controllers     # Functions for our APIs
    └───models          # Database models
    └───middlewares     # Contains all the middleware that we need
    └───utils           # Common functions that would be used repetitively
*/

const app = express();

var cookieSpecs : SessionOptions = {
  secret: COOKIE_KEY,
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: false
  },
  store: MongoStore.create({ mongoUrl: MONGO_URL })
}

if (ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  if (cookieSpecs.cookie) {
    cookieSpecs.cookie.secure = true // serve secure cookies
    cookieSpecs.cookie.sameSite = 'none' // enable cross domain cookies
  }
}

app.use(session(cookieSpecs));

app.use(cors({
  origin: CORS_ORIGINS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(loggerMiddleware);

app.use(router);

app.use(errorMiddleware);

export default app;
