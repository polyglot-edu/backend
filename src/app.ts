import express from 'express';
import bodyParser from "body-parser";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import router from "./routes";
import cors from "cors";
import { ENV } from "./utils/secrets";

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

if (ENV === 'production') {
  app.set('trust proxy', 1) // trust first proxy
}

app.use(cors({
  origin: (origin, callback) => {
    // automatically set cors origin header based on client request for faster developing
    // TODO: check domain cors in production env
    return callback(null, true);
  },
}));

app.use(bodyParser.json({limit: "1mb"}));
app.use(loggerMiddleware);

app.use(router);

export default app;