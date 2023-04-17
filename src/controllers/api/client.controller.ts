import { Task, Core } from "../../types/global.types";
import { RequestHandler } from "express";

/**
 * Serve core-, job- and task-id
 */
export const getSetup: RequestHandler = (_req, res) => {
    res.sendStatus(200);
};

/**
 * Serve core
 */
export const getCore: RequestHandler<Core> = (_req, res) => {
    res.sendStatus(200);
};

/**
 * Retrieve and serve task data
 */
export const getTask: RequestHandler<Task> = (req, res) => {
    const { coreId: coreid, jobId: jobid, taskId: taskid } = req.params;
    console.log("ids:", coreid, jobid, taskid);
    res.sendStatus(200);
};

/**
 * Post result to project owner
 */
export const postResult: RequestHandler<Task> = (_req, res) => {
    res.sendStatus(200);
};
