import JsonDB from "../services/json.db";
import { Project } from "../types/global.types";
import { NotImplementedError } from "../utils/errors";
import { ProjectUUID } from "../types/brand.types";
import { PROJECT_DB_PATH } from "../config";

export class ProjectModel extends JsonDB<Project[]> {
    constructor(path: string) {
        super(path, []);
        throw new NotImplementedError();
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
        throw new NotImplementedError();
    }

    projectCount(): number {
        throw new NotImplementedError();
    }

    isEmpty(): boolean {
        throw new NotImplementedError();
    }

    get projects(): Project[] {
        return this.data;
    }
}

const projectModel = new ProjectModel(PROJECT_DB_PATH);
export default projectModel;
