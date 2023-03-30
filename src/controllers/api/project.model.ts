import fs from "fs";
import { JobUUID, CoreUUID } from "../../types/brand.types";
import { Job, Core } from "../../types/param.types";
import { CORE_ROOT } from "../../config";
import { v4 } from "uuid";

export function checkCore(core: Core): number {
    core;
    // Function for furure testing of contents, before acceptance of core.
    return 200;
}

export function checkJob(job: Job) {
    job;
    // Function for furure testing of jobs, before acceptance of job.
    return true;
}

export function saveJob(job: Job) {
    job;
    // TODO: Implement job saving.
}

export function readJob(jobID: JobUUID) {
    jobID;
    // TODO: Implement job reading.
}

export function deleteCoreFile(coreId: CoreUUID): boolean {
    // TODO: Check if any jobs are using this core, and if so, do not delete.
    const path = CORE_ROOT + "/" + coreId + ".js";
    if (!fs.existsSync(path)) {
        return false;
    }

    fs.rmSync(path);
    return true;
}

export function createCoreObject(file: Express.Multer.File | string): Core {
    if (typeof file === "string") {
        return {
            coreid: v4() as CoreUUID,
            contents: Buffer.from(file)
        };
    } else {
        return {
            coreid: v4() as CoreUUID,
            contents: Buffer.from(file.buffer)
        };
    }
}
