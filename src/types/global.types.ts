import { BrandTypes } from ".";

/**
 * A job.
 *
 * @interface Job
 * @property {BrandTypes.JobUUID} jobid The job's unique identifier.
 * @property {BrandTypes.ProjectUUID} projectid The project that the job belongs to.
 * @property {BrandTypes.CoreUUID} coreid The core that the job uses.
 * @property {number} taskAmount The amount of tasks that the job is split into.
 * @property {number} failedTaskAmount The amount of tasks that have failed.
 * @property {Task[]} tasks The tasks that the job is split into.
 * @property {string} taskRequestEndpoint The endpoint that the core should send task requests to.
 * @property {string} taskResultEndpoint The endpoint that the core should send task results to.
 */
export interface Job {
    jobid: BrandTypes.JobUUID;
    projectid: BrandTypes.ProjectUUID;
    coreid: BrandTypes.CoreUUID;
    taskAmount: number;
    failedTaskAmount: number;
    tasks: Task[];
    taskRequestEndpoint: string; //url
    taskResultEndpoint: string; //url
}

/**
 * A project.
 *
 * @interface Project
 * @property {BrandTypes.ProjectUUID} projectid The project's unique identifier.
 * @property {Job[]} jobs The jobs that the project contains.
 */
export interface Project {
    projectid: BrandTypes.ProjectUUID;
    jobs: Job[];
}

/**
 * A core.
 *
 * @interface Core
 * @property {BrandTypes.CoreUUID} coreid The core's unique identifier.
 */
export interface Core {
    coreid: BrandTypes.CoreUUID;
    contents: Buffer;
}

/**
 * A task.
 *
 * @interface Task
 * @property {BrandTypes.TaskUUID} taskid The task's unique identifier.
 * @property {boolean} failed Whether or not the task has failed.
 */
export interface Task {
    taskid: BrandTypes.TaskUUID;
    failed: boolean;
}
