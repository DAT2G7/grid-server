import {
    createCoreAPI,
    createJob,
    deleteCore,
    deleteJob,
    readJob,
    createProject,
    updateJob
} from "../../controllers/api/project.controller";
import express, { RequestHandler } from "express";

import { handleInvalid } from "../../middleware/validators/invalid";
import { validateUUIDs } from "../../middleware/validators/uuid";
import bodyParser from "body-parser";
import multer from "multer";

const router = express.Router();
const upload = multer();

router.post("/core", upload.single("core"), createCoreAPI);

router.delete(
    "/core/:coreid",
    validateUUIDs("coreid"),
    handleInvalid,
    deleteCore as unknown as RequestHandler
);

router.post(
    "/job",
    bodyParser.json(), //Bodyparser is necessary to parse the body of the request
    handleInvalid,
    createJob as unknown as RequestHandler
);

router.get(
    "/:projectid/job/:jobid",
    validateUUIDs("projectid", "jobid"),
    handleInvalid,
    readJob as unknown as RequestHandler
);

router.put(
    "/job",
    bodyParser.json(), //Bodyparser is necessary to parse the body of the request
    handleInvalid,
    updateJob as unknown as RequestHandler
);

router.delete(
    "/:projectid/job/:jobid",
    validateUUIDs("projectid", "jobid"),
    handleInvalid,
    deleteJob as unknown as RequestHandler
);

router.post("/signup", createProject);

export { router as apiProjectRouter };
