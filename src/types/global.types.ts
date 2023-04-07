import { CoreUUID, JobUUID, ProjectUUID } from "./brand.types";

export interface Job {
    jobId: JobUUID;
    projectId: ProjectUUID;
    coreId: CoreUUID;
    taskAmount: number;
    taskRequestEndpoint: string; //url
    taskResultEndpoint: string; //url
}
export interface Project {
    projectId: ProjectUUID;
    jobs: Job[];
}
