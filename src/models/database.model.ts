import { Job, Project } from "../types/global.types";
import fs from "fs";
import { getRandomInt } from "../utils/random";
import { JobUUID } from "../types/brand.types";

export class ProjectDB {
    static data: Project[];
    static path: string;

    static setPath(path: string) {
        this.path = path;
        return ProjectDB;
    }

    static loadData() {
        this.data = JSON.parse(fs.readFileSync(this.path).toString());
    }

    static getRandomJob() {
        const project = this.data[getRandomInt(0, this.data.length)];
        const job = project.jobs[getRandomInt(0, project.jobs.length)];
        return job;
    }

    static saveData() {
        fs.writeFileSync(this.path, JSON.stringify(this.data, undefined, 4));
    }

    static incrementTaskAmount(jobId: JobUUID, increment: number) {
        this.data.forEach((project) => {
            project.jobs.forEach((job) => {
                if (job.jobId === jobId) {
                    job.taskAmount += increment;
                    if (job.taskAmount < 1) {
                        project.jobs.splice(project.jobs.indexOf(job), 1);
                    }
                    this.saveData();
                    return;
                }
            });
        });
    }

    static getJob(jobId: JobUUID): Job | undefined {
        this.data.forEach((project) => {
            project.jobs.forEach((job): Job | void => {
                if (job.jobId === jobId) {
                    return job;
                }
            });
        });
        return undefined;
    }
}
