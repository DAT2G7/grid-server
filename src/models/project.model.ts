import JsonDatabase from "../services/json.db";
import { ProjectUUID } from "../types/brand.types";
import { Project, Job } from "../types/global.types";
import { NotImplementedError } from "../utils/errors";

export default class ProjectModel implements Project {
    projectId: ProjectUUID;
    jobs: Job[];

    constructor() {
        throw new NotImplementedError();
    }

    getProject(): Project {
        throw new NotImplementedError();
    }

    randomJob(): Job {
        throw new NotImplementedError();
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    static randomProject(_projects: JsonDatabase<Project[]>): ProjectModel {
        throw new NotImplementedError();
    }
}
