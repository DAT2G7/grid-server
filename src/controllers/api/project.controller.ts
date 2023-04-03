import { Job, Core, Project } from "../../types/global.types";
import { RequestHandler } from "express";
import { CoreUUID } from "../../types/brand.types";
import { saveCore } from "../project.controller";
import { checkCore, createJobObject, checkJob } from "./project.model";
import { isDefined } from "../../utils/helpers";
import { deleteCoreFile } from "./project.model";
import { createCoreObject } from "../api/project.model";
import projectModel from "../../models/project.model";

/**
 * Receive project core
 * Creates the core object and saves it to the file system.
 * @param _req Request object.
 * @param res Response object.
 */
export const createCoreAPI: RequestHandler = (_req, res) => {
    if (!isDefined(_req.body)) {
        res.status(400);
        res.send("Error: Core file not received.");
        return;
    }

    const core: Core = createCoreObject(_req.body);

    const checkResult = checkCore(core);

    if (checkResult === 200) {
        saveCore(core);

        res.status(checkResult);
        res.contentType("application/json");
        res.json({ coreID: core.coreid });
    } else {
        res.status(checkResult);
        res.send("Error: Core validation failed. Core not saved.");
    }
};

/**
 * Endpoint for deleting a core.
 * @param _req Request object. Must contain a coreid.
 * @param res Response object. Returns 200 if core was deleted, 404 if core was not found. 400 if coreid was not provided.
 */
export const deleteCore: RequestHandler<Core> = (_req, res) => {
    if (!isDefined(_req.params.coreid)) {
        res.sendStatus(400);
        return;
    }

    if (!deleteCoreFile(_req.params.coreid as CoreUUID)) {
        res.sendStatus(404);
    }

    res.status(200);
    res.send("Core deleted.");
};

/**
 * Receive job for core
 * Creates the job object and saves it to the json db file.
 * @param _req Request object. Must contain a job object in the request body, that job must not contain a jobid.
 * @param res Response object. Returns 200 if job was created, along with a jobId in the response body. 400 if job failed validation or jobid was provided.
 * */
export const createJob: RequestHandler<Core> = (_req, res) => {
    // Make sure jobid is not provided.
    if (isDefined(_req.body.jobId)) {
        res.status(400);
        res.send(
            "Error: JobID was provided. If you want to update a job, use the PUT method."
        );
        return;
    }

    const job: Job = createJobObject(_req.body);

    // Make sure job is valid.
    if (!checkJob(job)) {
        res.status(400);
        res.send("Error: Job validation failed. Job not saved.");
        return;
    }

    res.contentType("application/json");
    res.json({ jobID: projectModel.addJob(job.projectId, job) });
    res.sendStatus(200);
};

/** @ignore */
export const readJob: RequestHandler<Job> = (_req, res) => {
    const job = projectModel.getJob(_req.params.projectId, _req.params.jobId);
    if (!job) {
        res.sendStatus(404);
        return;
    }

    res.contentType("application/json");
    res.status(200);
    res.json(job);
};

/** @ignore */
export const updateJob: RequestHandler<Job> = (_req, res) => {
    const job = createJobObject(_req.body);
    if (!checkJob(job)) {
        res.sendStatus(400);
        return;
    }

    projectModel.removeJob(job.projectId, job.jobId);
    projectModel.addJob(job.projectId, job);

    res.sendStatus(200);
};

/** @ignore */
export const deleteJob: RequestHandler<Job> = (_req, res) => {
    projectModel.removeJob(_req.params.projectId, _req.params.jobId);
    res.sendStatus(200);
};

/**
 * Create a new project
 * @param _req Request object.
 * @param res Response object.
 */
export const createProject: RequestHandler = (_req, res) => {
    const project = {} as Partial<Project>;
    project.projectId = projectModel.addProject(project);

    res.contentType("application/json");
    res.json(project.projectId);
};
