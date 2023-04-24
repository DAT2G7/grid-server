import { BrandTypes } from ".";

export interface Job {
    jobid?: BrandTypes.JobUUID;
    projectid: BrandTypes.ProjectUUID;
    coreid: BrandTypes.CoreUUID;
    taskAmount: number;
    taskRequestEndpoint: string; //url
    taskResultEndpoint: string; //url
}

export interface ClientTask {
    projectId: BrandTypes.ProjectUUID;
    coreId: BrandTypes.CoreUUID;
    jobId: BrandTypes.JobUUID;
    taskId: BrandTypes.TaskUUID;
}
