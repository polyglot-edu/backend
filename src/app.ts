import "./configs";
import express from 'express';
import router from "./routes";
import bodyParser from "body-parser";
import { loggerMiddleware } from "./middlewares/logger.middleware";

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

app.set("port", process.env.PORT || 3000);
app.set("env", process.env.NODE_ENV || "development");

app.use(loggerMiddleware)

app.use(bodyParser.json());
app.use(router);

export default app;