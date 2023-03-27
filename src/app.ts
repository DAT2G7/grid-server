import { apiClientRouter, apiProjectRouter } from "./routes/api";
import { clientRouter, indexRouter, projectRouter } from "./routes";

import { config as dotenvConfig } from "dotenv";
import express from "express";

dotenvConfig();

// init app
const app = express();
const port = process.env.PORT || 3000;

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

// Start server
app.listen(port, () => {
    console.log("Server started on port", port);
});
