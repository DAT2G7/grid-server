import JsonDB from "./json.db";
import fs from "fs";

jest.mock("fs");
const mockedFs = jest.mocked(fs);

describe("JsonDB", () => {
    let testDB: JsonDB<JsonTest>;

    test("loads data as provided type", () => {
        mockedFs.existsSync.mockImplementation(() => true);
        mockedFs.readFileSync.mockImplementation(() => jsonTestStringData);

        expect(jest.isMockFunction(mockedFs.existsSync)).toBeTruthy();
        expect(jest.isMockFunction(mockedFs.readFileSync)).toBeTruthy();

        testDB = new JsonDB<JsonTest>("test.json", {} as JsonTest);

        expect(testDB.data).toBeTruthy();
        expect(testDB.data).toEqual(JSON.parse(jsonTestStringData));
    });

    test("saves data in proper format", () => {
        mockedFs.writeFileSync.mockImplementation((_path, data) => {
            // Parse and stringify again to ensure whitespace settings do not modify the result
            const restringified = JSON.stringify(JSON.parse(data as string));

            expect(restringified).toEqual(jsonTestStringData);
        });
        expect(jest.isMockFunction(mockedFs.writeFileSync)).toBeTruthy();

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
