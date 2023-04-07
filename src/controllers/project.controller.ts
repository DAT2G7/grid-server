import { RequestHandler } from "express";
import { Core } from "../types/global.types";
import { writeFileSync } from "fs";
import { checkCore } from "./api/project.model";
import { CORE_ROOT } from "../config";
import { isDefined } from "../utils/helpers";
import { createCoreObject } from "./api/project.model";

/**
 * Serve the project owner index page
 */
export const renderIndex: RequestHandler = (_req, res) => {
    res.render("project/index");
};

/**
 * Receive project core
 */
export const createCore: RequestHandler = (_req, res) => {
    let recievedCore: Express.Multer.File;

    if (!isDefined(_req.file)) {
        res.status(400);
        res.send("Error: Core file not received.");
        return;
    } else {
        recievedCore = _req.file;
    }

    const core: Core = createCoreObject(recievedCore);

    const checkResult = checkCore(core);

    if (checkResult === 200) {
        saveCore(core);
        res.contentType("application/json");
        res.json({ coreID: core.coreid });
    } else {
        res.status(checkResult);
        res.send("Error: Core validation failed. Core not saved.");
        return;
    }
};

export function saveCore(core: Core) {
    const corePath: string = CORE_ROOT + "/" + core.coreid + ".js";
    try {
        writeFileSync(corePath, core.contents);
    } catch (e) {
        console.error(e);
    }
}
