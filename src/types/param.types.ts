import { BrandTypes } from ".";

export interface Core {
    coreid: BrandTypes.CoreUUID;
}

export interface Job {
    projectid: BrandTypes.ProjectUUID;
    jobid: BrandTypes.JobUUID;
}

export interface Task extends Job {
    taskid: BrandTypes.TaskUUID;
}
