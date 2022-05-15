import "./configs/dotenv.configs";
import express from 'express';
import bodyParser from "body-parser";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import router from "./routes";
import cors from "cors";

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

app.use(cors());

app.set("port", process.env.PORT || 3000);
app.set("env", process.env.NODE_ENV || "development");


app.use(bodyParser.json());
app.use(loggerMiddleware)

app.use(router);

export default app;