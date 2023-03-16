import { ParamTypes } from "../../types";
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
