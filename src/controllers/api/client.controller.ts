import { ParamTypes } from "../../types";
import { RequestHandler } from "express";
import db from "../../services/project.db";
import { getRandomElement } from "../../utils/random";
import { Job, Project } from "../../types/global.types";
import { v4 } from "uuid";

/**
 * Serve core-, job- and task-id
 */
export const getSetup: RequestHandler = (_req, res) => {
    //Get random project and random job from within that project
    const project = getRandomElement<Project>(db.data); //db.randomProject();

    const job = getRandomElement<Job>(project.jobs);

    if (!job) {
        throw new Error(`project ${project.projectId} does not have any jobs`);
        res.status(500);
    }

    const taskId = v4();

    const responseData = {
        projectId: project.projectId,
        jobId: job.jobId,
        coreId: job.coreId,
        taskId: taskId
    };

    // respond with jobId
    res.status(200).send(JSON.stringify(responseData));

    //Decrement task amount
    const { projectId, jobId } = responseData;
    db.incrementTaskAmount(projectId, jobId, -1);
};

/**
 * Serve core
 */
export const getCore: RequestHandler<ParamTypes.Core> = (_req, res) => {
    res.sendStatus(200);
};

/**
 * Retrieve and serve task data
 */
export const getTask: RequestHandler<ParamTypes.Task> = (req, res) => {
    const { coreid, jobid, taskid } = req.params;
    console.log("ids:", coreid, jobid, taskid);
    res.sendStatus(200);
};

/**
 * Post result to project owner
 */
export const postResult: RequestHandler<ParamTypes.Task> = (_req, res) => {
    res.sendStatus(200);
};
