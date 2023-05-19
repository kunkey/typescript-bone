import errorHandler from "errorhandler";

import app from "./app";
import config from "./config";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
const server = app.listen(config.PORT, () => {
    console.log(
        ">>> Server is running at port %d in %s mode",
        config.PORT,
        config.ENV
    );
    console.log(">>> Press CTRL-C to stop server\n");
});


export default server;
