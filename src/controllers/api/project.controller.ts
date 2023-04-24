import { Core, Job, Project } from "../../types/global.types";
import { ParamTypes } from "../../types";
import { BodyTypes } from "../../types";
import {
    checkCore,
    checkJob,
    createJobObject
} from "../../models/project.controller.model";

import { CoreUUID, ProjectUUID } from "../../types/brand.types";
import { RequestHandler } from "express";
import { createCoreObject } from "../../models/project.controller.model";
import { deleteCoreFile } from "../../models/project.controller.model";
import { isDefined } from "../../utils/helpers";
import projectModel from "../../models/project.model";
import { saveCore } from "../../models/project.controller.model";

/**
 * Receive project core
 * Creates the core object and saves it to the file system.
 * @param req Request object.
 * @param res Response object.
 */
export const createCoreAPI: RequestHandler<
    never,
    string,
    Express.Multer.File
> = (req, res) => {
    if (!isDefined(req.file)) {
        res.status(400);
        res.send("Error: Core file not received.");
        return;
    }

    const core: Core = createCoreObject(req.file);

    const checkResult = checkCore(core);

    if (checkResult === 201) {
        saveCore(core);

        res.status(checkResult);
        res.send(core.coreid.toString());
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
export const deleteCore: RequestHandler<ParamTypes.Core> = (req, res) => {
    if (!deleteCoreFile(req.params.coreid as CoreUUID)) {
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
export const createJob: RequestHandler<
    ParamTypes.Job,
    string,
    BodyTypes.Job
> = (req, res) => {
    // Make sure jobid is not provided.
    if (isDefined(req.body.jobid)) {
        res.status(400);
        res.send("Error: JobID was provided.");
        return;
    }

    const job: Job = createJobObject(req.body);

    // Make sure job is valid.
    if (!checkJob(job)) {
        res.status(400);
        res.send("Error: Job validation failed. Job not saved.");
        return;
    }

    if (!isDefined(projectModel.addJob(job.projectid, job))) {
        res.status(400);
        res.send("Error: Job could not be added to project.");
        return;
    } else {
        res.status(201);
        res.contentType("application/json");
        res.send(job.jobid.toString());
    }
};

export const readJob: RequestHandler<ParamTypes.Job> = (req, res) => {
    if (!isDefined(req.params.jobid)) {
        res.sendStatus(400);
        return;
    }

    const job = projectModel.getJob(
        req.params.projectid as ProjectUUID,
        req.params.jobid
    );
    if (!job) {
        res.sendStatus(404);
        return;
    }

    res.contentType("application/json");
    res.status(200);
    res.json(job);
};

export const updateJob: RequestHandler<ParamTypes.Job, never, BodyTypes.Job> = (
    req,
    res
) => {
    const job = createJobObject(req.body);
    if (!checkJob(job)) {
        res.sendStatus(400);
        return;
    }

    projectModel.removeJob(job.projectid, job.jobid);
    projectModel.addJob(job.projectid, job);

    res.sendStatus(200);
};

export const deleteJob: RequestHandler<ParamTypes.Job> = (req, res) => {
    if (!isDefined(req.params.projectid)) {
        res.sendStatus(400);
        return;
    }

    projectModel.removeJob(req.params.projectid, req.params.jobid);
    res.sendStatus(200);
};

/**
 * Create a new project
 * @param _req Request object.
 * @param res Response object.
 */
export const createProject: RequestHandler = (_req, res) => {
    const project = {} as Partial<Project>;
    project.projectid = projectModel.addProject(project);

    res.contentType("application/json");
    res.statusCode = 201;
    res.json(project.projectid);
};
