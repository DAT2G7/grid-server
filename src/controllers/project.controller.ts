import { RequestHandler } from "express";
import { v4 } from "uuid";
import { CoreUUID } from "../types/brand.types";
import { Core } from "../types/param.types";
import { writeFileSync } from "fs";
import { checkCore } from "./api/project.model";
import { CORE_ROOT } from "../config";

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

    const core: Core = {
        coreid: v4() as CoreUUID,
        contents: recievedCore.buffer
    };

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
    } catch {
        throw new Error("Error: Core file not saved.");
    }
}

function isDefined<T>(value: T | undefined): value is T {
    return value !== undefined && value !== null;
}
