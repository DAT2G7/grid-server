import {
    createCore,
    createJob,
    deleteCore,
    deleteJob,
    readJob,
    updateJob
} from "../../controllers/api/project.controller";

import express from "express";
import { handleInvalid } from "../../middleware/validators/invalid";
import { validateUUIDs } from "../../middleware/validators/uuid";

const router = express.Router();

router.post("/core", createCore);

router.delete(
    "/core/:coreid",
    ...validateUUIDs("coreid"),
    handleInvalid,
    deleteCore as any
);

router.post(
    "/core/:coreid/job",
    ...validateUUIDs("coreid"),
    handleInvalid,
    createJob as any
);

router.get(
    "/core/:coreid/job/:jobid",
    ...validateUUIDs("coreid", "jobid"),
    handleInvalid,
    readJob as any
);

router.put(
    "/core/:coreid/job/:jobid",
    ...validateUUIDs("coreid", "jobid"),
    handleInvalid,
    updateJob as any
);

router.delete(
    "/core/:coreid/job/:jobid",
    ...validateUUIDs("coreid", "jobid"),
    handleInvalid,
    deleteJob as any
);

export { router as apiProjectRouter };
