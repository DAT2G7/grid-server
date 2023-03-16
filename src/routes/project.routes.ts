import express from 'express';

const router = express.Router();

// Serve the project owner index page
router.get('/', (_req, res) => {
    res.render('project/index');
});

export { router as projectRouter };
