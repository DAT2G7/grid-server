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
        // Save the file with the current `data` value if it does not exist already.
        // This is most likely on first startup, in which case the `data` is provided by `defaultData`.
        if (!fs.existsSync(this.path)) return this.save();

        this.data = JSON.parse(fs.readFileSync(this.path).toString());
        return this;
    }

    save(): JsonDB<T> {
        // Create the directory from `path` if it doesn't exist already.
        const dirname = path.dirname(this.path);
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
        }

        // Stringify the JSON formatted with 4 spaces as indents, and save the result to the path.
        fs.writeFileSync(this.path, JSON.stringify(this.data, undefined, 4));
        return this;
    }
}
