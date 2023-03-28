import JsonDB from "./json.db";
import { Project } from "../types/global.types";
import { NotImplementedError } from "../utils/errors";
import { ProjectUUID } from "../types/brand.types";
import ProjectModel from "../models/project.model";

export default class ProjectDB extends JsonDB<ProjectModel[]> {
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

    randomProject(): ProjectModel {
        throw new NotImplementedError();
    }

    projectCount(): number {
        throw new NotImplementedError();
    }

    isEmpty(): boolean {
        throw new NotImplementedError();
    }

    get projects(): ProjectModel[] {
        return this.data;
    }
}

// const db = new ProjectDB("projects.json");

// if (db.isEmpty()) throw new Error("We have no projects!");

// const job = db.randomProject().randomJob();
// job.taskAmount--;
