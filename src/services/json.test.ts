import JsonDB from "./json.db";
import fs from "fs";

describe("JsonDB", () => {
    let testDB: JsonDB<JsonTestModel>;

    test("loads data as provided type", () => {
        jest.spyOn(fs, "readFileSync").mockImplementation(
            () => jsonTestStringData
        );

        testDB = new JsonDB<JsonTestModel>(
            "test.json",
            {} as JsonTestModel,
            JsonTestModel.fromJson
        );

        expect(testDB.data).toBeTruthy();
        expect(testDB.data.firstChild().reverseMessage()).toBe(
            jsonTestData.children[0].message.split("").reverse().join("")
        );
    });

    test("saves data in proper format", () => {
        jest.spyOn(fs, "writeFileSync").mockImplementation((_path, data) => {
            // Parse and stringify again to ensure whitespace settings do not modify the result
            const restringified = JSON.stringify(JSON.parse(data as string));

            expect(restringified).toEqual(jsonTestStringData);
        });

        testDB.save();
    });
});

interface JsonTest {
    int: number;
    float: number;
    date: Date;
    children: JsonTestChild[];
}

interface JsonTestChild {
    message: string;
}

class JsonTestModel implements JsonTest {
    int: number;
    float: number;
    date: Date;
    children: JsonTestChildModel[];

    constructor(data: JsonTest) {
        this.int = data.int;
        this.float = data.float;
        this.date = data.date;
        this.children = data.children as JsonTestChildModel[];
    }

    getDate(): Date {
        return new Date(this.date);
    }

    firstChild(): JsonTestChildModel {
        return this.children[0];
    }

    static fromJson(data: JsonTest): JsonTestModel {
        const children = data.children.map((child) =>
            JsonTestChildModel.fromJSON(child)
        );
        return new JsonTestModel({ ...data, children });
    }
}

class JsonTestChildModel implements JsonTestChild {
    message: string;

    constructor(data: JsonTestChild) {
        this.message = data.message;
    }

    reverseMessage() {
        return this.message.split("").reverse().join("");
    }

    static fromJSON(data: JsonTestChild): JsonTestChildModel {
        return new JsonTestChildModel(data);
    }
}

const jsonTestData: JsonTest = {
    int: 5,
    float: 2.5,
    date: new Date(),
    children: [
        { message: "Hello, World 1!" },
        { message: "Hello, World 2!" },
        { message: "Hello, World 3!" },
        { message: "Hello, World 4!" }
    ]
};

const jsonTestStringData = JSON.stringify(jsonTestData);
