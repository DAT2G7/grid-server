import { CORE_ROOT } from "../config";
import { Core } from "../types/global.types";
import { RequestHandler } from "express";
import { checkCore } from "./api/project.model";
import { createCoreObject } from "./api/project.model";
import { isDefined } from "../utils/helpers";
import { writeFileSync } from "fs";

/**
 * Serve the project owner index page
 */
export const renderIndex: RequestHandler = (_req, res) => {
    res.render("project/index");
};

/**
 * Receive project core
 */
export const createCore: RequestHandler = (req, res) => {
    let recievedCore: Express.Multer.File;

    if (!isDefined(req.file)) {
        res.status(400);
        res.send("Error: Core file not received.");
        return;
    } else {
        recievedCore = req.file;
    }

    const core: Core = createCoreObject(recievedCore);

    const checkResult = checkCore(core);

    if (checkResult === 201) {
        saveCore(core);
        res.contentType("application/json");
        res.json({ coreID: core.coreId });
    } else {
        res.status(checkResult);
        res.send("Error: Core validation failed. Core not saved.");
        return;
    }
};

export function saveCore(core: Core) {
    const corePath: string = CORE_ROOT + "/" + core.coreId + ".js";
    try {
        writeFileSync(corePath, core.contents);
    } catch (e) {
        console.error(e);
    }
}
