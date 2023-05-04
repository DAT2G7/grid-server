import { apiClientRouter, apiProjectRouter } from "./routes/api";
import { clientRouter, indexRouter, projectRouter } from "./routes";

import fs from "fs";
import express from "express";
import config from "./config";
import http from "http";
import https from "https";

// initialize project model
import projectModel from "./models/project.model";
import { getSSLCredentials } from "./utils/helpers";
import bodyParser from "body-parser";
projectModel;

// ensure existence of core directory
if (!fs.existsSync(config.CORE_ROOT)) {
    fs.mkdirSync(config.CORE_ROOT, { recursive: true });
}

// init app
const app = express();

// Add body parser middleware to parse JSON body, and set limit to 50mb.
app.use(bodyParser.json({ limit: "50mb" }));

// Attempt to get SSL credentials.
const credentials = getSSLCredentials();

// Use pug for views
app.set("view engine", "pug");
app.set("views", "src/public/views");

// Set endpoint for static assets
app.use("/static", express.static("dist/public/static"));

// Register view routes
app.use("/client", clientRouter);
app.use("/project", projectRouter);
app.use("/", indexRouter);

// Register API routes
app.use("/api/client", apiClientRouter);
app.use("/api/project", apiProjectRouter);

// Create and start http server.
const httpServer = http.createServer(app);
httpServer.listen(config.PORT);
console.log("HTTP listening on port " + config.PORT + ".");

// Create and start https server if credentials are found.
if (credentials) {
    const httpsServer = https.createServer(credentials, app);
    httpsServer.listen(config.HTTPS_PORT);
    console.log("HTTPS listening on port " + config.HTTPS_PORT + ".");
} else if (config.MODE === "production") {
    // If production mode, then SSL is mandatory.
    throw new Error("SSL certificate or key not found.");
} else {
    // If not production mode, then SSL is optional, but warn developer.
    console.warn("SSL certificate or key not found. Running on http only.");
}
