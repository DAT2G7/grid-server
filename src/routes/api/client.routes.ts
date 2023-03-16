import express from 'express';
import { handleInvalid } from '../../middleware/validators/invalid';
import { validateUUIDs } from '../../middleware/validators/uuid';

const router = express.Router();

// Serve core-, job- and task-id
router.get('/setup', (_req, res) => {
    res.sendStatus(200);
});

// Serve core
router.get(
    '/core/:coreid',
    ...validateUUIDs('coreid'),
    handleInvalid,
    (req, res) => {
        console.log('coreid:', req.params.coreid);
        res.sendStatus(200);
    }
);

// Retrieve and serve task data
router.get(
    '/core/:coreid/job/:jobid/task/:taskid',
    ...validateUUIDs('coreid', 'jobid', 'taskid'),
    handleInvalid,
    (_req, res) => {
        res.sendStatus(200);
    }
);

// Post result to project owner
router.post(
    '/core/:coreid/job/:jobid/task/:taskid',
    ...validateUUIDs('coreid', 'jobid', 'taskid'),
    handleInvalid,
    (_req, res) => {
        res.sendStatus(200);
    }
);

export { router as apiClientRouter };
