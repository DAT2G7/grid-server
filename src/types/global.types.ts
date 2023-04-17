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
    coreId: BrandTypes.CoreUUID;
    contents: Buffer;
}

export interface Task {
    taskId: BrandTypes.TaskUUID;
    jobId: BrandTypes.JobUUID;
    coreId: BrandTypes.CoreUUID;
}
