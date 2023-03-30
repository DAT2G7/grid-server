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
     * Refresh data from JSON file.
     * @returns Itself
     */
    refresh(): JsonDB<T> {
        try {
            this.data = JSON.parse(fs.readFileSync(this.path).toString());
        } catch (error) {
            this.save();
        }
        return this;
    }

    save(): JsonDB<T> {
        //ensureDirectoryExistence(this.path);
        const dirname = path.dirname(this.path);
        if (!fs.existsSync(dirname)) {
            fs.mkdirSync(dirname, { recursive: true });
        }

        fs.writeFileSync(this.path, JSON.stringify(this.data, undefined, 4));
        return this;
    }
}
