import { BrandTypes } from ".";

export interface Job {
    jobId: BrandTypes.JobUUID;
    projectId: BrandTypes.ProjectUUID;
    coreId: BrandTypes.CoreUUID;
    taskAmount: number;
    taskRequestEndpoint: string; //url
    taskResultEndpoint: string; //url
}
export interface Project {
    projectId: BrandTypes.ProjectUUID;
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
