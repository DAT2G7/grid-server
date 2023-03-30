import { CoreUUID, JobUUID, ProjectUUID } from "./brand.types";

export interface Job {
    jobId: JobUUID;
    taskAmount: number;
    taskRequestEndpoint: string; //url
    taskResultEndpoint: string; //url
}

export interface Core {
    coreId: CoreUUID;
    jobs: Job[];
}

export interface Project {
    projectId: ProjectUUID;
    cores: Core[];
}
