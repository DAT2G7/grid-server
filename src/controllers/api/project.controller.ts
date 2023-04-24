import { Core, Job, Project } from "../../types/global.types";
import {
    checkCore,
    checkJob,
    createJobObject,
    saveCore
} from "./project.model";

import { CoreUUID } from "../../types/brand.types";
import { RequestHandler } from "express";
import { createCoreObject } from "../api/project.model";
import { deleteCoreFile } from "./project.model";
import { isDefined } from "../../utils/helpers";
import projectModel from "../../models/project.model";

/**
 * Receive project core
 * Creates the core object and saves it to the file system.
 * @param req Request object.
 * @param res Response object.
 */
export const createCoreAPI: RequestHandler<
    Record<string, never>,
    unknown,
    Express.Multer.File
> = (req, res) => {
    if (!isDefined(req.body)) {
        res.status(400);
        res.send("Error: Core file not received.");
        return;
    }

    const core: Core = createCoreObject(req.body);

    const checkResult = checkCore(core);

    if (checkResult === 201) {
        saveCore(core);

        res.status(checkResult);
        res.contentType("application/json");
        res.json({ coreId: core.coreId });
    } else {
        res.status(checkResult);
        res.send("Error: Core validation failed. Core not saved.");
    }
};

/**
 * Endpoint for deleting a core.
 * @param req Request object. Must contain a coreid.
 * @param res Response object. Returns 200 if core was deleted, 404 if core was not found. 400 if coreid was not provided.
 */
export const deleteCore: RequestHandler<Core> = (req, res) => {
    if (!deleteCoreFile(req.params.coreId as CoreUUID)) {
        res.sendStatus(404);
    }

    res.status(200);
    res.send("Core deleted.");
};

/**
 * Receive job for core
 * Creates the job object and saves it to the json db file.
 * @param req Request object. Must contain a job object in the request body, that job must not contain a jobid.
 * @param res Response object. Returns 200 if job was created, along with a jobId in the response body. 400 if job failed validation or jobid was provided.
 * */
export const createJob: RequestHandler<Core> = (req, res) => {
    // Make sure jobid is not provided.
    if (isDefined(req.body.jobId)) {
        res.status(400);
        res.send(
            "Error: JobID was provided. If you want to update a job, use the PUT method."
        );
        return;
    }

    const job: Job = createJobObject(req.body);

    // Make sure job is valid.
    if (!checkJob(job)) {
        res.status(400);
        res.send("Error: Job validation failed. Job not saved.");
        return;
    }

    res.contentType("application/json");
    res.json({ jobID: projectModel.addJob(job.projectId, job) });
    res.sendStatus(201);
};

export const readJob: RequestHandler<Job> = (req, res) => {
    const job = projectModel.getJob(req.params.projectId, req.params.jobId);
    if (!job) {
        res.sendStatus(404);
        return;
    }

    res.contentType("application/json");
    res.status(200);
    res.json(job);
};

export const updateJob: RequestHandler<Job> = (req, res) => {
    const job = createJobObject(req.body);
    if (!checkJob(job)) {
        res.sendStatus(400);
        return;
    }

    projectModel.removeJob(job.projectId, job.jobId);
    projectModel.addJob(job.projectId, job);

    res.sendStatus(200);
};

export const deleteJob: RequestHandler<Job> = (req, res) => {
    projectModel.removeJob(req.params.projectId, req.params.jobId);
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
    res.statusCode = 201;
    res.json(project.projectId);
};
