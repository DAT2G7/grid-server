import express, { RequestHandler } from "express";
import {
    getCore,
    getSetup,
    getTask,
    postResult
} from "../../controllers/api/client.controller";

import { handleInvalid } from "../../middleware/validators/invalid";
import { validateUUIDs } from "../../middleware/validators/uuid";

const router = express.Router();

router.get("/setup", getSetup);

router.get(
    "/core/:coreid",
    validateUUIDs("coreid"),
    handleInvalid,
    getCore as unknown as RequestHandler
);
router.get;

router.get(
    "/core/:coreid/job/:jobid/task/:taskid",
    validateUUIDs("coreid", "jobid", "taskid"),
    handleInvalid,
    getTask as unknown as RequestHandler
);

router.post(
    "/core/:coreid/job/:jobid/task/:taskid",
    validateUUIDs("coreid", "jobid", "taskid"),
    handleInvalid,
    postResult as unknown as RequestHandler
);

export { router as apiClientRouter };
