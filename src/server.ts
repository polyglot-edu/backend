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

// @ts-ignore
let cached = global.mongoose;

if (!cached) {
    // @ts-ignore
    cached = global.mongoose = { conn: null, promise: null }
}

/**
 * Start Express server.
 */
const server = app.listen(PORT,async () => {
    // https://github.com/vercel/next.js/blob/canary/examples/with-mongodb-mongoose/lib/dbConnect.js
    if (cached.conn) {
        console.log('=> using existing database connection');
        return;
    }
    if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_URL,{bufferCommands: false})
        .then(db => {
            console.log("  Database connected!\n");
            return db;
        })

        console.log(
            "  App is running at http://localhost:%d in %s mode  🚀🚀",
            PORT,
            ENV
        );
        console.log("  Press CTRL-C to stop\n");
    }
    try {
        cached.conn = await cached.promise
    } catch (e) {
        cached.promise = null
        throw e
    }

});

export default server;