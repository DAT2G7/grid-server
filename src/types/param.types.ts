import { BrandTypes } from ".";

export interface Core {
    coreid: BrandTypes.CoreUUID;
}

export interface Project {
    projectid: BrandTypes.ProjectUUID;
}

export interface Job extends Project {
    jobid: BrandTypes.JobUUID;
}

export interface Task extends Job {
    taskid: BrandTypes.TaskUUID;
}
