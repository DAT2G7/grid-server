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

    randomJob(): Job {
        throw new NotImplementedError();
    }

    static randomProject(db: JsonDatabase<Project[]>): ProjectModel {
        db;
        throw new NotImplementedError();
    }
}
