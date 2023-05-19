import express from "express";
import compression from "compression";  // compresses requests
import bodyParser from "body-parser";
import morgan from "morgan";
import session from "express-session";
import config from "./config";
import cors from "cors";
import { models } from "./models/index";
import APIController from "./controllers/api/APIController";
import path from "path";
//import logger from "@util/logger";
import strongParams from "./middleware/parameters";


models.then(() => {
    console.log("Connected Database");
}).catch((err) => {
    console.log("Connect Database Error", err);
});


const app = express();
app.use(compression());
app.use(morgan("[:date[iso]][:method :url HTTP/:http-version] Completed with status :status in :response-time ms ")); // sử dụng để log mọi request ra console
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: config.SESSION_SECRET,
}));

app.use(cors());
app.options("*", cors());

app.use(strongParams());
app.use("/api", APIController);

export default app;