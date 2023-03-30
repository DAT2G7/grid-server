// import { NotImplementedError } from "../utils/errors";
import fs from "fs";
export default class JsonDB<T> {
    readonly path: string;
    data: T;

    constructor(path: string, defaultData: T) {
        this.path = path;
        defaultData;
        this.data = JSON.parse(fs.readFileSync(path).toString());
        //throw new NotImplementedError();
    }

    /**
     * Refresh data in class by loading from JSON file.
     * @returns Itself
     */
    refresh(): JsonDB<T> {
        this.data = JSON.parse(fs.readFileSync(this.path).toString());
        return this;
        // throw new NotImplementedError();
    }

    save(): JsonDB<T> {
        fs.writeFileSync(this.path, JSON.stringify(this.data, undefined, 4));
        return this;
        // throw new NotImplementedError();
    }
}
