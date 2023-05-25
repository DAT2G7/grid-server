/**
 * @module BodyTypes
 * @description Types for request body objects.
 */

import { BrandTypes } from ".";

/**
 * A job.
 *
 * @interface Job
 * @property {BrandTypes.ProjectUUID} projectid The project that the job belongs to. Can be undefined if the job has not yet been assigned a UUID.
 * @property {BrandTypes.CoreUUID} coreid The core that the job uses.
 * @property {number} taskAmount The amount of tasks that the job is split into.
 * @property {string} taskRequestEndpoint The endpoint that the core should send task requests to.
 * @property {string} taskResultEndpoint The endpoint that the core should send task results to.
 */
export interface Job {
    jobid?: BrandTypes.JobUUID;
    projectid: BrandTypes.ProjectUUID;
    coreid: BrandTypes.CoreUUID;
    taskAmount: number;
    taskRequestEndpoint: string; //url
    taskResultEndpoint: string; //url
}

/**
 * A task sent to the client.
 *
 * @interface ClientTask
 * @property {BrandTypes.ProjectUUID} projectId The project that the task belongs to.
 * @property {BrandTypes.CoreUUID} coreId The core that the task belongs to.
 * @property {BrandTypes.JobUUID} jobId The job that the task belongs to.
 * @property {BrandTypes.TaskUUID} taskId The task's unique identifier.
 */
export interface ClientTask {
    projectId: BrandTypes.ProjectUUID;
    coreId: BrandTypes.CoreUUID;
    jobId: BrandTypes.JobUUID;
    taskId: BrandTypes.TaskUUID;
}
