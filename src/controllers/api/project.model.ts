import fs from "fs";
import { JobUUID, CoreUUID } from "../../types/brand.types";
import { Job, Core } from "../../types/global.types";
import { CORE_ROOT } from "../../config";
import { v4 } from "uuid";
import { ProjectModel } from "../../models/project.model";
import { PROJECT_DB_PATH } from "../../config";

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

export function saveJob(job: Job): JobUUID {
    const dbModel = new ProjectModel(PROJECT_DB_PATH);
    dbModel.addJob(job.projectId, job);
    return job.jobId;
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

export function createJobObject(json: string) {
    const incomingJob = JSON.parse(json);

    const job = {
        jobId: v4() as JobUUID,
        coreId: incomingJob.coreId,
        projectId: incomingJob.projectId,
        taskAmount: incomingJob.taskAmount,
        taskRequestEndpoint: incomingJob.taskRequestEndpoint,
        taskResultEndpoint: incomingJob.taskResultEndpoint
    };

    return job;
}
