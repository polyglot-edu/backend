import errorHandler from "errorhandler";
import app from "./app";
import mongoose from 'mongoose';
import { MONGO_URL, PORT, ENV } from "./utils/secrets";

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
const server = app.listen(PORT, async () => {
    await mongoose.connect(MONGO_URL)
    .then(() => console.log("  Database connected!\n"))
    .catch((error) => {
        console.log(error);
    });
    console.log(
        "  App is running at http://localhost:%d in %s mode  🚀🚀",
        PORT,
        ENV
    );
    console.log("  Press CTRL-C to stop\n");
});

export default server;