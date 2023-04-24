import { Core, Job } from "../types/global.types";
import { CoreUUID, JobUUID, ProjectUUID } from "../types/brand.types";

import { CORE_ROOT } from "../config";
import dbModel from "./project.model";
import fs from "fs";
import { v4 } from "uuid";
import { writeFileSync } from "fs";

export function checkCore(core: Core): number {
    core;
    // Function for furure testing of contents, before acceptance of core.
    return 201;
}

/**
 * Responsible for checking incoming jobs before they are added to the database.
 * @param job The job object that needs to be validated.
 * @returns boolean, true if the job is valid, false if not.
 */
export function checkJob(job: Job) {
    // Check if the core needed by the job exists.
    if (!fs.existsSync(CORE_ROOT + "/" + job.coreid + ".js")) {
        return false;
    }

    return true;
}

/**
 * Responsible for retrieving a job from the database.
 * @param projectId The projectId of the project that the job belongs to.
 * @param jobID The jobID of the job that needs to be retrieved.
 * @returns The job object that was requested.
 */
export function readJob(projectId: ProjectUUID, jobID: JobUUID) {
    return dbModel.getJob(projectId, jobID);
}

/**
 * Saves a core to disk
 * @param core core file to save
 */
export function saveCore(core: Core) {
    const corePath: string = CORE_ROOT + "/" + core.coreid + ".js";
    try {
        writeFileSync(corePath, core.contents);
    } catch (e) {
        console.error(e);
    }
}

/**
 * Responsible for deleting a core from the file system.
 * @param coreId The coreId of the core that needs to be deleted.
 * @returns boolean, true if the core was deleted, false if the core doesn't exist.
 */
export function deleteCoreFile(coreId: CoreUUID): boolean {
    // TODO: Check if any jobs are depending on this core, and if so, do not delete.
    const path = CORE_ROOT + "/" + coreId + ".js";
    if (!fs.existsSync(path)) {
        return false;
    }

    fs.rmSync(path);
    return true;
}

/**
 * Resposible for creating a core object from a file.
 * @param file The core file that needs to be saved.
 * @returns returns the core object created from the file.
 */
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

/**
 * Responsible for adding a JobUUID to a job object, if one is not already present.
 * @param incomingJob The job object that needs to be checked.
 * @returns The job object with a JobUUID.
 */
export function createJobObject(incomingJob: Partial<Job>): Job {
    incomingJob.jobid ??= v4() as JobUUID;

    return incomingJob as Job;
}

/** Responsible for checking whether a core exists in the file system.
 * @param coreId The coreId of the core that needs to be checked.
 * @returns boolean, true if the core exists, false if not.
 * */
export function coreExists(coreId: CoreUUID): boolean {
    return fs.existsSync(CORE_ROOT + "/" + coreId + ".js");
}
