import { BrandTypes } from ".";

export interface Core {
    coreid: BrandTypes.CoreUUID;
}

export interface Job extends Core {
    jobid: BrandTypes.JobUUID;
}

export interface Task extends Job {
    taskid: BrandTypes.TaskUUID;
}
