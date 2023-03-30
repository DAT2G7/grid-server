import JsonDB from "../services/json.db";
import { Project, Job } from "../types/global.types";
import { NotImplementedError } from "../utils/errors";
import { ProjectUUID, JobUUID } from "../types/brand.types";
import { PROJECT_DB_PATH } from "../config";

export class ProjectModel extends JsonDB<Project[]> {
    constructor(path: string) {
        super(path, []);
    }

    addProject(project: Project) {
        project;
        throw new NotImplementedError();
    }

    getProject(projectId: ProjectUUID): Project | null {
        return (
            this.data.find(
                (project: Project) => project.projectId === projectId
            ) || null
        );
    }

    removeProject(projectId: ProjectUUID): void {
        projectId;
        throw new NotImplementedError();
    }

    getRandomProject(): Project {
        throw new NotImplementedError();
    }

    addJob(projectId: ProjectUUID, job: Partial<Job>) {
        projectId;
        job;
        console.log(job);
        // job.jobId ||= v4();
        throw new NotImplementedError();
    }

    getJob(projectId: ProjectUUID, jobId: JobUUID): Job | null {
        const project = this.data.find(
            (project: Project) => project.projectId === projectId
        );

        if (!project) {
            console.error(
                `Attempt to access non-existing project (project id ${projectId})`
            );
            return null;
        }

        const job = project.jobs.find((job: Job) => job.jobId === jobId);

        return job || null;
    }

    removeJob(projectId: ProjectUUID, jobId: JobUUID) {
        const project = this.getProject(projectId);
        if (!project) return;

        const job = project.jobs.find((job: Job) => job.jobId === jobId);
        if (!job) return;

        const jobIndex = project.jobs.indexOf(job);
        if (jobIndex === -1) return;

        project.jobs.splice(jobIndex, 1);
    }

    getRandomJob() {
        throw new NotImplementedError();
    }

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

const projectModel = new ProjectModel(PROJECT_DB_PATH);
export default projectModel;
