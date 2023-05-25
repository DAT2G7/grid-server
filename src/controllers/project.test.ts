import fs from "fs";
import { v4 } from "uuid";
import { CORE_ROOT } from "../config";
import { CoreUUID } from "../types/brand.types";
import { Core } from "../types/global.types";
import { saveCore } from "../models/project.controller.model";

// jest mocks fs for saveCore test
jest.mock("fs");

//Tests savecore through the webside
describe("saveCore", () => {
    const mockCore = createMockCore();

    beforeAll(() => {
        jest.resetModules();
        saveCore(mockCore); // calls the function with the mock core
    });
    it("should call writeFileSync", () => {
        expect(fs.writeFileSync).toHaveBeenCalled();
    });
    it("should call writeFileSync with correct path and content", () => {
        expect(fs.writeFileSync).toHaveBeenCalledWith(
            CORE_ROOT + "/" + mockCore.coreid + ".js",
            mockCore.contents
        );
    });
});

/**
 * Creates a mock core for testing.
 * @returns a mock core
 */
function createMockCore(): Core {
    const mockCore = {
        coreid: v4() as CoreUUID,
        contents: Buffer.from("function mockCore() { return (1 + 1); }")
    };
    return mockCore;
}
