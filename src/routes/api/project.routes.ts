import express from 'express';
import { handleInvalid } from '../../middleware/validators/invalid';
import { validateUUIDs } from '../../middleware/validators/uuid';

const router = express.Router();

// Receive project core
router.post('/core', (_req, res) => {
    res.sendStatus(200);
});

// Receive job for core
router.post(
    '/core/:coreid/job',
    ...validateUUIDs('coreid'),
    handleInvalid,
    (_req, res) => {
        res.sendStatus(200);
    }
);

export { router as apiProjectRouter };
