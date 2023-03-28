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
    if (
        _req.file === undefined ||
        !checkCore({ coreid: v4() as CoreUUID, contents: _req.file.buffer })
    ) {
        res.status(418); // I'm a teapot
        res.send("Error: Core contents not found failed.");
        // TODO: Return status code that repressents actual error.
    } else {
        const core: Core = {
            coreid: v4() as CoreUUID,
            contents: _req.file.buffer
        };
        saveCore(core);

        res.status(200);
        res.contentType("application/json");
        res.json({ coreID: core.coreid });
    }
};

export function saveCore(core: Core) {
    const corePath: string = CORE_ROOT + "/" + core.coreid + ".js";
    try {
        writeFileSync(corePath, core.contents);
    } catch {
        // TODO: Handle file write error.
    }
}
