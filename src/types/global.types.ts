import { BrandTypes } from ".";

export interface Job {
    jobid: BrandTypes.JobUUID;
    projectid: BrandTypes.ProjectUUID;
    coreid: BrandTypes.CoreUUID;
    taskAmount: number;
    taskRequestEndpoint: string; //url
    taskResultEndpoint: string; //url
}
export interface Project {
    projectid: BrandTypes.ProjectUUID;
    jobs: Job[];
}

export interface Core {
    coreid: BrandTypes.CoreUUID;
    contents: Buffer;
}

export interface Task {
    taskid: BrandTypes.TaskUUID;
    jobid: BrandTypes.JobUUID;
    coreid: BrandTypes.CoreUUID;
}
