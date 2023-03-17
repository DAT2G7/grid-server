import {
    createCore,
    createJob,
    deleteCore,
    deleteJob,
    readJob,
    updateJob
} from "../../controllers/api/project.controller";
import express, { RequestHandler } from "express";

import { handleInvalid } from "../../middleware/validators/invalid";
import { validateUUIDs } from "../../middleware/validators/uuid";

const router = express.Router();

router.post("/core", createCore);

router.delete(
    "/core/:coreid",
    validateUUIDs("coreid"),
    handleInvalid,
    deleteCore as unknown as RequestHandler
);

router.post(
    "/core/:coreid/job",
    validateUUIDs("coreid"),
    handleInvalid,
    createJob as unknown as RequestHandler
);

router.get(
    "/core/:coreid/job/:jobid",
    validateUUIDs("coreid", "jobid"),
    handleInvalid,
    readJob as unknown as RequestHandler
);

router.put(
    "/core/:coreid/job/:jobid",
    validateUUIDs("coreid", "jobid"),
    handleInvalid,
    updateJob as unknown as RequestHandler
);

router.delete(
    "/core/:coreid/job/:jobid",
    validateUUIDs("coreid", "jobid"),
    handleInvalid,
    deleteJob as unknown as RequestHandler
);

export { router as apiProjectRouter };
