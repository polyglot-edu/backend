import errorHandler from "errorhandler";
import app from "./app";
import mongoose from 'mongoose';
import { MONGO_URL, PORT, ENV } from "./utils/secrets";
import { execTest } from "./R/execute";

/**
 * Error Handler. Provides full stack
 */
if (ENV === "development") {
    console.log("  Using errorhandler");
    app.use(errorHandler());
}

/**
 * Start Express server.
 */
const server = app.listen(PORT,async () => {
    execTest();
    await mongoose.connect(MONGO_URL);
    console.log("  Database Connected!");
    console.log(
        "  App is running at http://localhost:%d in %s mode  🚀🚀",
        PORT,
        ENV
    );
    console.log("  Press CTRL-C to stop\n");
});

export default server;