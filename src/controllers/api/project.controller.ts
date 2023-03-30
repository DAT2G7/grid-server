import { ParamTypes } from "../../types";
import { RequestHandler } from "express";
import { CoreUUID } from "../../types/brand.types";
import { saveCore } from "../project.controller";
import { checkCore } from "./project.model";
import { Core } from "../../types/param.types";
import { isDefined } from "../../utils/helpers";
import { deleteCoreFile } from "./project.model";
import { createCoreObject } from "../api/project.model";

/**
 * Receive project core
 */
export const createCoreAPI: RequestHandler = (_req, res) => {
    if (!isDefined(_req.body)) {
        res.status(400);
        res.send("Error: Core file not received.");
        return;
    }

    const core: Core = createCoreObject(_req.body);

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
    console.log(_req.params);
    if (!isDefined(_req.params.coreid)) {
        res.sendStatus(400);
        return;
    }

    if (!deleteCoreFile(_req.params.coreid as CoreUUID)) {
        res.sendStatus(404);
    }

    res.status(200);
    res.send("Core deleted.");
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
