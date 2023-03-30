import JsonDB from "./json.db";
import fs from "fs";

describe("JsonDB", () => {
    let testDB: JsonDB<JsonTest>;

    test("loads data as provided type", () => {
        jest.spyOn(fs, "readFileSync").mockImplementation(
            () => jsonTestStringData
        );

        testDB = new JsonDB<JsonTest>("test.json", {} as JsonTest);

        expect(testDB.data).toBeTruthy();
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
