import { NotImplementedError } from "../utils/errors";

export default class JsonDB<T> {
    readonly path: string;
    data: T;

    constructor(path: string, defaultData: T) {
        path;
        defaultData;
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
