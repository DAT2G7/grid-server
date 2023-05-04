import express, { RequestHandler } from "express";
import {
    getCore,
    getSetup,
    getTask,
    postResult,
    terminateTask
} from "../../controllers/api/client.controller";

import { handleInvalid } from "../../middleware/validators/invalid";
import { validateUUIDs } from "../../middleware/validators/uuid";
import bodyParser from "body-parser";

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
    "/project/:projectid/job/:jobid/task/:taskid",
    validateUUIDs("projectid", "jobid", "taskid"),
    handleInvalid,
    getTask as unknown as RequestHandler
);

router.post(
    "/project/:projectid/job/:jobid/task/:taskid",
    validateUUIDs("projectid", "jobid", "taskid"),
    bodyParser.json(),
    handleInvalid,
    postResult as unknown as RequestHandler
);

router.post(
    "terminate/:projectid/job/:jobid/task/:taskid",
    validateUUIDs("projectid", "jobid", "taskid"),
    handleInvalid,
    terminateTask as unknown as RequestHandler
);

export { router as apiClientRouter };
