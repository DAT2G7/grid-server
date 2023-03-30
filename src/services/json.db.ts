import fs from "fs";

export default class JsonDB<T> {
    readonly path: string;
    data: T;

    constructor(path: string, defaultData: T) {
        this.path = path;
        this.data = defaultData;

        this.refresh();
    }

    /**
     * Refresh data from JSON file.
     * @returns Itself
     */
    refresh(): JsonDB<T> {
        this.data = JSON.parse(fs.readFileSync(this.path).toString());
        return this;
    }

    save(): JsonDB<T> {
        fs.writeFileSync(this.path, JSON.stringify(this.data, undefined, 4));
        return this;
    }
}
