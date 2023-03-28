// import ProjectModel from '../models/project.model';
// import { Project } from '../types/global.types';

import { NotImplementedError } from "../utils/errors";

export default class JsonDB<T> {
    readonly path: string;
    data: T;

    constructor(path: string) {
        path;
        throw new NotImplementedError();
    }

    /**
     * Refresh data from JSON file.
     * @returns Itself
     */
    refresh(): JsonDB<T> {
        throw new NotImplementedError();
    }

    save(): JsonDB<T> {
        throw new NotImplementedError();
    }
}

// const db = new JsonDB<ProjectModel[]>("wdqqwd.json");

// const job = ProjectModel.randomProject(db).randomJob();
// job.taskAmount--;
