import { BrandTypes } from ".";

export interface Job {
    jobid?: BrandTypes.JobUUID;
    projectid: BrandTypes.ProjectUUID;
    coreid: BrandTypes.CoreUUID;
    taskAmount: number;
    taskRequestEndpoint: string; //url
    taskResultEndpoint: string; //url
}
import { UUID, CoreUUID, JobUUID, TaskUUID } from "./brand.types";

export interface ClientTask {
    // TODO: use the `ProjectUUID` type from another branch once that gets merged
    projectId: UUID;
    coreId: CoreUUID;
    jobId: JobUUID;
    taskId: TaskUUID;
}
