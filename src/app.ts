import { clientRouter, indexRouter, projectOwnerRouter } from "./routes";

import express from "express";

// init app
const app = express();
const port = 3000;

// Use pug for views
app.set('view engine', 'pug');
app.set('views', 'src/public/views');

// Set endpoint for static assets
app.use('/static', express.static('dist/public/static'));

// Register routes
app.use('/project-owner', projectOwnerRouter);
app.use('/client', clientRouter);
app.use('/', indexRouter);

// Start server
app.listen(port, () => {
    console.log('Server started on port', port);
});