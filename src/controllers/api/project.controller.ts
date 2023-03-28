import { ParamTypes } from "../../types";
import { RequestHandler } from "express";
import { CoreUUID } from "../../types/brand.types";
import { saveCore } from "../project.controller";
import { checkCore } from "./project.model";

/**
 * Receive project core
 */
export const createCoreAPI: RequestHandler = (_req, res) => {
    if (checkCore(_req.body)) {
        const coreID: CoreUUID = saveCore(_req.body);

        res.status(200);
        res.contentType("application/json");
        res.json({ coreID: coreID });
    } else {
        res.status(418); // I'm a teapot
        // TODO: Return status code that repressents actual error.
        res.send("Error: Core authentication failed.");
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
