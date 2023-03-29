import { NotImplementedError } from "../utils/errors";
import fs from "fs";

export default class JsonDB<T> {
    readonly path: string;
    readonly fromJSON?: (data: any) => T;
    data: T;

    constructor(path: string, defaultData: T, fromJSON?: (data: any) => T) {
        this.path = path;
        this.data = defaultData;
        this.fromJSON = fromJSON;

        this.refresh();
    }

    /**
     * Refresh data from JSON file.
     * @returns Itself
     */
    refresh(): JsonDB<T> {
        const jsonData = JSON.parse(fs.readFileSync(this.path).toString());
        this.data = this.fromJSON ? this.fromJSON(jsonData) : jsonData;
        return this;
    }

    save(): JsonDB<T> {
        throw new NotImplementedError();
    }
}
