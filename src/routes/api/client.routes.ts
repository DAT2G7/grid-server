import {
    getCore,
    getSetup,
    getTask,
    postResult
} from "../../controllers/api/client.controller";

import express from "express";
import { handleInvalid } from "../../middleware/validators/invalid";
import { validateUUIDs } from "../../middleware/validators/uuid";

const router = express.Router();

router.get("/setup", getSetup);

router.get(
    "/core/:coreid",
    ...validateUUIDs("coreid"),
    handleInvalid,
    getCore as any
);
router.get;

router.get(
    "/core/:coreid/job/:jobid/task/:taskid",
    ...validateUUIDs("coreid", "jobid", "taskid"),
    handleInvalid,
    getTask as any
);

router.post(
    "/core/:coreid/job/:jobid/task/:taskid",
    ...validateUUIDs("coreid", "jobid", "taskid"),
    handleInvalid,
    postResult as any
);

export { router as apiClientRouter };
