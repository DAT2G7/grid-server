import express from 'express';

export const clientRouter = express.Router();

clientRouter.get('/', (_req, res) => {
    res.send('Hello Client!');
});