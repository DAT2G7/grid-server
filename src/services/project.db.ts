import JsonDB from "./json.db";
import { Job, Project } from "../types/global.types";
import { NotImplementedError } from "../utils/errors";
import { JobUUID, ProjectUUID } from "../types/brand.types";
import { getRandomInt } from "../utils/random";
import { DEFAULT_PROJECTS_JSON_PATH } from "../config";

export class ProjectDB extends JsonDB<Project[]> {
    constructor(path: string) {
        super(path, []);
        // throw new NotImplementedError();
    }

    removeProjectById(id: ProjectUUID) {
        id;
        throw new NotImplementedError();
    }

    removeProject(project: Project) {
        project;
        throw new NotImplementedError();
    }

    addProject(project: Project) {
        project;
        throw new NotImplementedError();
    }

    randomProject(): Project {
        return this.data[getRandomInt(0, this.data.length)];
        //throw new NotImplementedError();
    }

    projectCount(): number {
        throw new NotImplementedError();
    }

    isEmpty(): boolean {
        throw new NotImplementedError();
    }

    incrementTaskAmount(
        projectId: ProjectUUID,
        jobId: JobUUID,
        increment: number
    ): void {
        this.refresh();

        const project = this.data.find(
            (project: Project) => project.projectId === projectId
        );

        if (!project) {
            return;
        }

        const job = project.jobs.find((job: Job) => job.jobId === jobId);

        if (!job) {
            return;
        }

        job.taskAmount += increment;

        if (job.taskAmount < 1) {
            const jobIndex = project.jobs.indexOf(job);
            project.jobs.splice(jobIndex, 1);
        }

        this.save();
    }

    get projects(): Project[] {
        return this.data;
    }
}

const projectDB = new ProjectDB(process.cwd() + DEFAULT_PROJECTS_JSON_PATH);
export default projectDB;
