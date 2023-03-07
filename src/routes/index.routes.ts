import express from 'express';

export const indexRouter = express.Router();

indexRouter.get('/', (_req, res) => {
    // res.send('Hello Index!');
    res.render('index');
});