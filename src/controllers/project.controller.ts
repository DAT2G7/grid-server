import { RequestHandler } from "express";
import { v4 } from "uuid";
import { CoreUUID } from "../types/brand.types";
import { writeFileSync } from "fs";
import { homedir } from "os";
import { checkCore } from "./api/project.model";

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
    if (_req.file === undefined || !checkCore(_req.file.buffer)) {
        res.status(418); // I'm a teapot
        res.send("Error: Core authentication failed.");
    } else {
        const coreID: CoreUUID = saveCore(_req.file.buffer);

        res.status(200);
        res.contentType("application/json");
        res.json({ coreID: coreID });
    }
};

export function saveCore(fileBuffer: Buffer): CoreUUID {
    const newUUID: string = v4();

    const corePath: string = homedir() + "/cores/" + newUUID + ".js";

    try {
        writeFileSync(corePath, fileBuffer);
    } catch {
        // TODO: Handle file write error.
    }

    return newUUID as CoreUUID;
}
