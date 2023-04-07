import fs from "fs";
import { v4 } from "uuid";
import { CORE_ROOT } from "../config";
import { CoreUUID } from "../types/brand.types";
import { Core } from "../types/global.types";
import { saveCore } from "./project.controller";

jest.mock("fs");
const mockedFs = jest.mocked(fs);

test("saveCore", () => {
    const mockCore: Core = createMockCore();

    mockedFs.writeFileSync.mockImplementation((_path, data) => {
        expect(_path).toBe(CORE_ROOT + "/" + mockCore.coreid + ".js");
        expect(data).toEqual(mockCore.contents);
    });
    expect(jest.isMockFunction(mockedFs.writeFileSync)).toBeTruthy();
    saveCore(mockCore);
});

function createMockCore(): Core {
    const mockCore = {
        coreid: v4() as CoreUUID,
        contents: Buffer.from("function mockCore() { return (1 + 1); }")
    };
    return mockCore;
}
