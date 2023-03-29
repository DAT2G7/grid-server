import { ProjectUUID } from "../types/brand.types";
import { Project, Job } from "../types/global.types";
import { NotImplementedError } from "../utils/errors";
import JobModel from "./job.model";

export default class ProjectModel implements Project {
    projectId: ProjectUUID;
    jobs: Job[];

    constructor() {
        throw new NotImplementedError();
    }

    randomJob(): JobModel {
        throw new NotImplementedError();
    }
}
