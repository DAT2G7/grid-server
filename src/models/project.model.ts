import { Job, Project, Task } from "../types/global.types";
import { JobUUID, ProjectUUID, TaskUUID } from "../types/brand.types";

import JsonDB from "../services/json.db";
import { ObjectRecord } from "../types/utility.types";
import { PROJECT_DB_PATH } from "../config";
import { getRandomElement } from "../utils/random";
import { v4 as uuid } from "uuid";

export class ProjectModel extends JsonDB<Project[]> {
    constructor(path: string) {
        super(path, []);
    }

    /**
     * Adds a project to the project model and saves database.
     * @param {Project} project - The project to be added.
     * @returns The ID of the added project.
     */
    addProject(project: Partial<Project>): ProjectUUID {
        project.projectid ||= uuid() as ProjectUUID;
        project.jobs ||= [];

        this.data.push(project as Project);
        this.save();

        return project.projectid;
    }

    /**
     * Retrieves a project by its ID.
     * @param {ProjectUUID} projectid - The project ID.
     * @returns {Project | null} The project if found, or null if not found.
     */
    getProject(projectid: ProjectUUID): Project | null {
        return (
            this.data.find(
                (project: Project) => project.projectid === projectid
            ) || null
        );
    }

    /**
     * Removes a project by its ID and saves database.
     * @param {ProjectUUID} projectid - The project ID.
     */
    removeProject(projectid: ProjectUUID): void {
        const project = this.data.find(
            (project) => project.projectid === projectid
        );

        if (!project) return;

        this.data.splice(this.data.indexOf(project), 1);
        this.save();
    }

    /**
     * Returns a random project.
     * @returns {Project} The random project.
     */
    getRandomProject(): Project | null {
        const eligibleProjects = this.projects.filter((project) =>
            project.jobs.some(
                (job) => job.taskAmount > 0 || job.failedTaskAmount > 0
            )
        );

        return eligibleProjects.length
            ? getRandomElement(eligibleProjects)
            : null;
    }

    /**
     * Adds a job to the specified project and saves the database.
     * @param {ProjectUUID} projectid - The ID of the project.
     * @param {AddJobPayload} job - The job payload with no jobid and projectid.
     * @returns {JobUUID | null} The ID of the added job or null if the project is not found.
     */
    addJob(projectid: ProjectUUID, job: AddJobPayload): JobUUID | null {
        const _job: Job = {
            ...job,
            jobid: uuid() as JobUUID,
            projectid: projectid,
            failedTaskAmount: 0,
            tasks: []
        };

        const project = this.getProject(projectid);
        if (!project) return null;

        project.jobs.push(_job);
        this.save();

        return _job.jobid;
    }

    /**
     * Updates a job by its ID from the specified project and saves the database.
     * @param {ProjectUUID} projectid - The ID of the project.
     * @param {JobUUID} jobid - The ID of the job.
     * @param {Partial<Job>} job - A partial job with the new entry values.
     * @returns {JobUUID | null} The job id if found and updated, or null if not found.
     */
    updateJob(
        projectid: ProjectUUID,
        jobid: JobUUID,
        job: Partial<Job>
    ): JobUUID | null {
        const oldJob = this.getJob(projectid, jobid);
        if (!oldJob) return null;

        const modifiable = oldJob as unknown as ObjectRecord<Job>;

        Object.entries(job).forEach(([key, value]) => {
            if (key === "jobid" || key === "projectid") return;

            // Note: The nullish coalescing opperator (??) returns the left-hand operand unless
            // it is `null` or `undefined`, in which case the right-hand operand is returned.
            // Used here to skip the entry if value is missing or less than one.
            if (key === "taskAmount" && (job["taskAmount"] ?? 0) < 1) return;

            if (value) modifiable[key as keyof Job] = value;
        });

        this.save();

        return oldJob.jobid;
    }

    /**
     * Retrieves a job by its ID from the specified project.
     * @param {ProjectUUID} projectid - The ID of the project.
     * @param {JobUUID} jobid - The ID of the job.
     * @returns {Job | null} The job if found, or null if not found.
     */
    getJob(projectid: ProjectUUID, jobid: JobUUID): Job | null {
        const project = this.getProject(projectid);
        if (!project) return null;

        const job = project.jobs.find((job: Job) => job.jobid === jobid);

        return job || null;
    }

    /**
     * Removes a job to from the specified project and saves database.
     * @param {ProjectUUID} projectid - The ID of the project.
     * @param {JobUUID} jobid - The ID of the job.
     */
    removeJob(projectid: ProjectUUID, jobid: JobUUID) {
        const project = this.getProject(projectid);
        if (!project) return;

        const jobIndex = project.jobs.findIndex((job) => job.jobid === jobid);
        if (jobIndex === -1) return;

        project.jobs.splice(jobIndex, 1);

        this.save();
    }

    /**
     * Retrieves a random job from the specified project or from all projects if no projectid is provided.
     * @param {ProjectUUID} [projectid] - Optional ID of the project to fetch the job from.
     * @returns {Job | null} The random job if found, or null if not found.
     */
    getRandomJob(projectid?: ProjectUUID): Job | null {
        const project = projectid
            ? this.getProject(projectid)
            : this.getRandomProject();

        if (!project) return null;

        const jobs = project.jobs.filter(
            (job) => job.taskAmount > 0 || job.failedTaskAmount > 0
        );
        if (jobs.length === 0) return null;

        return getRandomElement(jobs);
    }

    /**
     * Sets the task amount of a job to a specified value and saves the database.
     * @param {ProjectUUID} projectid - The ID of the project.
     * @param {JobUUID} jobid - The ID of the job.
     * @param {number} amount - The new job amount value.
     */
    setTaskAmount(
        projectid: ProjectUUID,
        jobid: JobUUID,
        amount: number
    ): void {
        const job = this.getJob(projectid, jobid);
        if (!job) return;

        job.taskAmount = amount;

        this.save();
    }

    /**
     * Increments the task amount of a job by the specified amount and saves the database.
     * @param {ProjectUUID} projectid - The ID of the project.
     * @param {JobUUID} jobid - The ID of the job.
     * @param {number} amount - The increment amount.
     */
    incrementTaskAmount(
        projectid: ProjectUUID,
        jobid: JobUUID,
        amount: number
    ): void {
        const job = this.getJob(projectid, jobid);
        if (!job) return;

        this.setTaskAmount(projectid, jobid, job.taskAmount + amount);
    }

    /**
     * Adds a new task to a job and saves the database.
     * @param projectid The ID of the project in which the job is stored.
     * @param jobid The ID of the job.
     * @param taskid The ID of the task.
     */
    addNewTask(projectid: ProjectUUID, jobid: JobUUID, taskid: TaskUUID): void {
        const job = this.getJob(projectid, jobid);
        if (!job) return;

        const task: Task = {
            taskid: taskid,
            failed: false
        };

        job.tasks.push(task);

        this.save();
    }

    /**
     * Removes a task from the specified job and saves the database.
     * @param projectid The ID of the project that contains the job.
     * @param jobid The ID of the job that contains the task.
     * @param taskid The ID of the task to be removed.
     */
    removeTask(projectid: ProjectUUID, jobid: JobUUID, taskid: TaskUUID): void {
        const job = this.getJob(projectid, jobid);
        if (!job) return;

        const taskIndex = job.tasks.findIndex((task) => task.taskid === taskid);
        if (taskIndex === -1) return;

        job.tasks.splice(taskIndex, 1);
    }

    /**
     * Retrieves the ID of a failed task from the specified job.
     * @param projectid The ID of the project that contains the job.
     * @param jobid The ID of the job in which to search for failed tasks.
     * @returns The ID of the failed task, or null if a failed task was not found.
     */
    getFailedTaskId(projectid: ProjectUUID, jobid: JobUUID): TaskUUID | null {
        const job = this.getJob(projectid, jobid);
        if (!job) return null;

        const task = job.tasks.find((task) => task.failed);
        if (!task) return null;

        return task.taskid;
    }

    /**
     * Updates the failed status of a specified task within a job and saves the database.
     * @param projectid The ID of the project that contains the job.
     * @param jobid The ID of the job that contains the task.
     * @param taskid The ID of the task to be updated.
     * @param state The new state of the task.
     */
    setTaskIsFailed(
        projectid: ProjectUUID,
        jobid: JobUUID,
        taskid: TaskUUID,
        state: boolean
    ): void {
        const job = this.getJob(projectid, jobid);
        if (!job) return;

        const task = job.tasks.find((task) => task.taskid === taskid);
        if (!task) return;

        task.failed = state;

        this.save();
    }

    /**
     * Increments the failed task amount of a job by a specified amount and saves the database.
     * @param projectid The ID of the project that contains the job.
     * @param jobid The ID of the job to be updated.
     * @param amount The increment amount.
     * @returns
     */
    incrementFailedTaskAmount(
        projectid: ProjectUUID,
        jobid: JobUUID,
        amount: number
    ): void {
        const job = this.getJob(projectid, jobid);
        if (!job) return;

        job.failedTaskAmount += amount;

        this.save();
    }

    /**
     * Retrieves a task based on the task ID.
     * @param projectid The ID of the project that contains the job.
     * @param jobid The ID of the job that contaisn the task.
     * @param taskid The ID of the task to be retrieved.
     * @returns The task if found, or null if not found.
     */
    getTask(
        projectid: ProjectUUID,
        jobid: JobUUID,
        taskid: TaskUUID
    ): Task | null {
        const job = this.getJob(projectid, jobid);
        if (!job) return null;

        const task = job.tasks.find((task) => task.taskid === taskid);
        if (!task) return null;

        return task;
    }

    /**
     * Removes all of the completed jobs from the database.
     */
    removeCompletedJobs(): void {
        this.projects.forEach((project) => {
            project.jobs.forEach((job) => {
                if (job.taskAmount === 0 && job.tasks.length === 0) {
                    this.removeJob(project.projectid, job.jobid);
                }
            });
        });
    }

    get projects(): Project[] {
        return this.data;
    }
}

/**
 * The payload for the `addJob` method in `ProjectModel`.
 * A `Job` with certain unecessary fields omitted.
 */
export type AddJobPayload = Omit<
    Job,
    "jobid" | "projectid" | "failedTaskAmount" | "tasks"
>;

/**
 * The singleton instance (using module caching) of the `ProjectModel` class.
 */
const projectModel = new ProjectModel(PROJECT_DB_PATH);
export default projectModel;
