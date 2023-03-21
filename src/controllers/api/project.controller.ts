import { ParamTypes } from "../../types";
import { RequestHandler } from "express";
import { UUID } from "../../types/brand.types";
import { saveCore } from "./project.model";
import { checkCore } from "./project.model";

/**
 * Receive project core
 */
export const createCore: RequestHandler = (_req, res) => {
    const requestBody = _req.body; // Is the body just the raw js?

    if (checkCore(requestBody)) {
        const coreID: UUID = saveCore(requestBody);
        // TODO: Add core id to response body and return success response.
    } else {
        // TODO: Handle rejected core, and return failed response.
    }
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
