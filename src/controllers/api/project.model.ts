import { JobUUID } from "../../types/brand.types";
import { Job, Core } from "../../types/param.types";

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
