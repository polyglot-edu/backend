import errorHandler from "errorhandler";
import app from "./app";
import mongoose from 'mongoose';
import { MONGO_URL, PORT, ENV, TEST_MODE } from "./utils/secrets";
import User from './models/user.model';

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
    await mongoose.connect(MONGO_URL);
    console.log("  Database Connected!");
    console.log(
        "  App is running at http://localhost:%d in %s mode  🚀🚀",
        PORT,
        ENV
    );
    console.log("  Press CTRL-C to stop\n");
    
    if (TEST_MODE) {
        const user = await User.findOne({username: "guest"});
        if (!user) {
            await User.create({
                username: "guest"
            });
        }
    }
});

export default server;