import { ParamTypes } from "../../types";
import { RequestHandler } from "express";

/**
 * Receive project core
 */
export const createCore: RequestHandler = (_req, res) => {
    res.sendStatus(200);
};

/** @ignore */
export const deleteCore: RequestHandler<ParamTypes.Core> = (_req, res) => {
    res.sendStatus(404);
};

/**
 * Receive job for core
 */
export const createJob: RequestHandler<ParamTypes.Core> = (_req, res) => {
    res.sendStatus(200);
};

/** @ignore */
export const readJob: RequestHandler<ParamTypes.Job> = (_req, res) => {
    res.sendStatus(404);
};

/** @ignore */
export const updateJob: RequestHandler<ParamTypes.Job> = (_req, res) => {
    res.sendStatus(404);
};

/** @ignore */
export const deleteJob: RequestHandler<ParamTypes.Job> = (_req, res) => {
    res.sendStatus(404);
};
