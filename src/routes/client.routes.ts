import express from 'express';

const router = express.Router();

// Serve the client index page
router.get('/', (_req, res) => {
    res.render('client/index');
});

export { router as clientRouter };
