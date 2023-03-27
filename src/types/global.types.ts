import { UUID } from "./brand.types";

export interface Job {
    jobId: UUID;
    coreId: UUID;
    taskAmount: number;
    taskRequestEndpoint: string; //url
    taskResultEndpoint: string; //url
}

export interface Project {
    projectId: UUID;
    jobs: Job[];
}
