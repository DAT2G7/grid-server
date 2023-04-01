import fs from "fs";
import path from "path";

export default class JsonDB<T> {
    readonly path: string;
    data: T;

    constructor(path: string, defaultData: T) {
        this.path = path;
        this.data = defaultData;

        this.refresh();
    }

    /**
     * Refreshes the in-memory data by reading the JSON file from disk.
     * If the file does not exist, saves the current data to disk.
     * @returns {JsonDB<T>} The current JsonDB instance for method chaining.
     */
    refresh(): JsonDB<T> {
        if (!fs.existsSync(this.path)) return this.save();

        this.data = JSON.parse(fs.readFileSync(this.path).toString());
        return this;
    }

    save(): JsonDB<T> {
        const dirname = path.dirname(this.path);
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
        }

        fs.writeFileSync(this.path, JSON.stringify(this.data, undefined, 4));
        return this;
    }
}
