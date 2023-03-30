import { ProjectUUID } from "../types/brand.types";
import { Project, Core } from "../types/global.types";
import { NotImplementedError } from "../utils/errors";
import CoreModel from "./core.model";

export default class ProjectModel implements Project {
    projectId: ProjectUUID;
    cores: Core[];

    constructor() {
        throw new NotImplementedError();
    }

    randomCore(): CoreModel {
        throw new NotImplementedError();
    }
}
