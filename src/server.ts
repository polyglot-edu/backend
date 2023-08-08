import errorHandler from "errorhandler";
import app from "./app";
import mongoose from 'mongoose';
import { MONGO_URL, PORT, ENV, TEST_MODE } from "./utils/secrets";
import User from './models/user.model';
import learningPath from './guestExamples.json'
import { updateFlowQuery } from "./controllers/flows.controllers";
import PolyglotFlowModel from "./models/flow.model"

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
        let user = await User.findOne({username: "guest"});
        if (!user) {
            user = await User.create({
                username: "guest"
            });
        }
        learningPath.forEach(async (lp) => {
            lp.author = user?._id
            try {
                await PolyglotFlowModel.create(lp);
            } catch (e) {}
            await updateFlowQuery(lp._id,lp as any);
        })
    }
});

export default server;