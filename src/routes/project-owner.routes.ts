import express from 'express';

export const projectOwnerRouter = express.Router();

projectOwnerRouter.get('/', (_req, res) => {
    res.send('Hello Project owner!');
});