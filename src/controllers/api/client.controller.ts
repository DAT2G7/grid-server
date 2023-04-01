import { ParamTypes } from "../../types";
import { RequestHandler } from "express";
import db from "../../models/project.model";
import { getId } from "../../services/uuid";
import { ClientTask } from "../../types/body.types";
import { TaskUUID } from "../../types/brand.types";
import path from "path";
import config from "../../config";

/**
 * Serve core-, job- and task-id
 */
export const getSetup: RequestHandler<Record<string, never>, ClientTask> = (
    _req,
    res
) => {
    //Get random project and random job from within that project
    const job = db.getRandomJob();

    if (!job) {
        res.status(500);
        throw new Error(`no projects has jobs`);
    }

    const responseData: ClientTask = {
        projectId: job.projectId,
        jobId: job.jobId,
        coreId: job.coreId,
        taskId: getId() as TaskUUID
    };

    // respond with jobId
    res.status(200).send(responseData);

    //Decrement task amount
    const { projectId, jobId } = responseData;
    db.decrementTaskAmount(projectId, jobId);
};

/**
 * Serve core
 */
export const getCore: RequestHandler<ParamTypes.Core, Buffer> = (_req, res) => {
    const { coreid } = _req.params;
    res.sendFile(path.resolve(config.CORE_ROOT, coreid + ".js"));
};

/**
 * Retrieve and serve task data
 */
export const getTask: RequestHandler<ParamTypes.Task> = (req, res) => {
    const { projectid, jobid, taskid } = req.params;
    console.log("ids:", projectid, jobid, taskid);
    res.sendStatus(200);
};

/**
 * Post result to project owner
 */
export const postResult: RequestHandler<ParamTypes.Task> = (_req, res) => {
    res.sendStatus(200);
};
