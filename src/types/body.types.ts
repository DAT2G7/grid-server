import { ProjectUUID, CoreUUID, JobUUID, TaskUUID } from "./brand.types";

export interface ClientTask {
    projectId: ProjectUUID;
    coreId: CoreUUID;
    jobId: JobUUID;
    taskId: TaskUUID;
}
