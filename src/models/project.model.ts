import JsonDB from "../services/json.db";
import { Project, Job } from "../types/global.types";
import { ProjectUUID, JobUUID } from "../types/brand.types";
import { getRandomInt, getRandomElement } from "../utils/random";
import { v4 as uuid } from "uuid";
import { PROJECT_DB_PATH } from "../config";

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
        project.projectId ||= uuid() as ProjectUUID;
        project.jobs ||= [];

        this.data.push(project as Project);
        this.save();

        return project.projectId;
    }

    /**
     * Retrieves a project by its ID.
     * @param {ProjectUUID} projectId - The project ID.
     * @returns {Project | null} The project if found, or null if not found.
     */
    getProject(projectId: ProjectUUID): Project | null {
        return (
            this.data.find(
                (project: Project) => project.projectId === projectId
            ) || null
        );
    }

    /**
     * Removes a project by its ID and saves database.
     * @param {ProjectUUID} projectId - The project ID.
     */
    removeProject(projectId: ProjectUUID): void {
        const project = this.data.find(
            (project) => project.projectId === projectId
        );

        if (!project) return;

        this.data.splice(this.data.indexOf(project), 1);
        this.save();
    }

    /**
     * Returns a random project.
     * @returns {Project} The random< project.
     */
    getRandomProject(): Project {
        return this.data[getRandomInt(0, this.data.length)];
    }

    /**
     * Adds a job to the specified project and saves the database.
     * @param {ProjectUUID} projectId - The ID of the project.
     * @param {AddJobPayload} job - The job payload with optional jobId and projectId.
     * @returns {JobUUID | null} The ID of the added job or null if the project is not found.
     */
    addJob(projectId: ProjectUUID, job: AddJobPayload): JobUUID | null {
        job.jobId ||= uuid() as JobUUID;
        job.projectId ||= projectId;

        const project = this.getProject(projectId);
        if (!project) return null;

        project.jobs.push(job as Job);
        this.save();

        return job.jobId;
    }

    /**
     * Retrieves a job by its ID from the specified project.
     * @param {ProjectUUID} projectId - The ID of the project.
     * @param {JobUUID} jobId - The ID of the job.
     * @returns {Job | null} The job if found, or null if not found.
     */
    getJob(projectId: ProjectUUID, jobId: JobUUID): Job | null {
        const project = this.getProject(projectId);
        if (!project) return null;

        const job = project.jobs.find((job: Job) => job.jobId === jobId);

        return job || null;
    }

    /**
     * Removes a job to from the specified project and saves database.
     * @param {ProjectUUID} projectId - The ID of the project.
     * @param {JobUUID} jobId - The ID of the job.
     */
    removeJob(projectId: ProjectUUID, jobId: JobUUID) {
        const project = this.getProject(projectId);
        if (!project) return;

        const jobIndex = project.jobs.findIndex((job) => job.jobId === jobId);
        if (jobIndex === -1) return;

        project.jobs.splice(jobIndex, 1);

        this.save();
    }

    /**
     * Retrieves a random job from the specified project or from all projects if no projectId is provided.
     * @param {ProjectUUID} [projectId] - Optional ID of the project to fetch the job from.
     * @returns {Job | null} The random job if found, or null if not found.
     */
    getRandomJob(projectId?: ProjectUUID): Job | null {
        const projects = projectId
            ? [this.getProject(projectId)]
            : this.projects;

        const eligibleProjects = projects.filter(
            (project): project is Project =>
                project !== null && project.jobs.length > 0
        );

        if (eligibleProjects.length === 0) return null;

        const jobs = eligibleProjects.flatMap((project) => project.jobs);
        return getRandomElement(jobs);
    }

    /**
     * Increments the task amount of a job by a specified value and saves the database.
     * @param {ProjectUUID} projectId - The ID of the project.
     * @param {JobUUID} jobId - The ID of the job.
     * @param {number} increment - The increment value.
     */
    incrementTaskAmount(
        projectId: ProjectUUID,
        jobId: JobUUID,
        increment: number
    ): void {
        this.refresh();

        const job = this.getJob(projectId, jobId);
        if (!job) return;

        job.taskAmount += increment;

        if (job.taskAmount < 1) this.removeJob(projectId, jobId);

        this.save();
    }

    get projects(): Project[] {
        return this.data;
    }
}

export interface AddJobPayload extends Omit<Job, "jobId" | "projectId"> {
    jobId?: JobUUID;
    projectId?: ProjectUUID;
}

const projectModel = new ProjectModel(PROJECT_DB_PATH);
export default projectModel;