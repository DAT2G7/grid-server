import { ParamTypes } from "../../types";
import { RequestHandler } from "express";
import db from "../../models/project.model";
import { getId } from "../../utils/random";

/**
 * Serve core-, job- and task-id
 */
export const getSetup: RequestHandler = (_req, res) => {
    //Get random project and random job from within that project
    const job = db.getRandomJob();

    if (!job) {
        res.status(500);
        throw new Error(`no projects has jobs`);
    }

    const responseData = {
        projectId: job.projectId,
        jobId: job.jobId,
        coreId: job.coreId,
        taskId: getId()
    };

    // respond with jobId
    res.status(200).send(JSON.stringify(responseData));

    //Decrement task amount
    const { projectId, jobId } = responseData;
    db.decrementTaskAmount(projectId, jobId);
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
