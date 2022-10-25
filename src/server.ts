import errorHandler from "errorhandler";
import app from "./app";
import mongoose from 'mongoose';

/**
 * Error Handler. Provides full stack
 */
if (app.get("env") === "development") {
    console.log("  Using errorhandler");
    app.use(errorHandler());
}

const MONGO_URL = process.env.MONGO_URL || 'mongodb://prova:SECRET@mongodb:27017';

/**
 * Start Express server.
 */
const server = app.listen(app.get("port"), async () => {
    await mongoose.connect(MONGO_URL)
    .then(() => console.log("  Database connected!\n"))
    .catch((error) => {
        console.log(error);
    });
    console.log(
        "  App is running at http://localhost:%d in %s mode  🚀🚀",
        app.get("port"),
        app.get("env")
    );
    console.log("  Press CTRL-C to stop\n");
});

export default server;