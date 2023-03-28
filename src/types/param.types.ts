import { BrandTypes } from ".";

export interface Core {
    coreid: BrandTypes.CoreUUID;
    contents: Buffer;
}

export interface Job extends Core {
    jobid: BrandTypes.JobUUID;
}

export interface Task extends Job {
    taskid: BrandTypes.TaskUUID;
}
