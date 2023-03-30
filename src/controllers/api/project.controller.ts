import { ParamTypes } from "../../types";
import { RequestHandler } from "express";
import { CoreUUID } from "../../types/brand.types";
import { saveCore } from "../project.controller";
import { checkCore } from "./project.model";
import { Core } from "../../types/param.types";
import { v4 } from "uuid";

/**
 * Receive project core
 */
export const createCoreAPI: RequestHandler = (_req, res) => {
    const core: Core = {
        coreid: v4() as CoreUUID,
        contents: Buffer.from(_req.body)
    };

    const checkResult = checkCore(core);

    if (checkResult === 200) {
        saveCore(core);

        res.status(checkResult);
        res.contentType("application/json");
        res.json({ coreID: core.coreid });
    } else {
        res.status(checkResult);
        res.send("Error: Core validation failed. Core not saved.");
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
