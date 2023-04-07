import fs from "fs";
import { v4 } from "uuid";
import { CoreUUID, JobUUID, ProjectUUID } from "../../types/brand.types";
import { Job, Core } from "../../types/global.types";
import { CORE_ROOT } from "../../config";
import {
    checkCore,
    createJobObject,
    checkJob,
    deleteCoreFile,
    coreExists
} from "./project.model";

jest.mock("fs");

test("checkCore", () => {
    const mockCore: Core = createMockCore();

    const expectedResult = 200;
    const actualResult = checkCore(mockCore);

    expect(actualResult).toBe(expectedResult);
});

describe("deleteCoreFile", () => {
    const mockCore = createMockCore();

    beforeAll(() => {
        jest.resetModules();
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        deleteCoreFile(mockCore.coreid);
    });

    it("should call fs.existsSync", () => {
        expect(fs.existsSync).toHaveBeenCalled();
    });

    it("should call fs.existsSync with correct path", () => {
        expect(fs.existsSync).toHaveBeenCalledWith(
            CORE_ROOT + "/" + mockCore.coreid + ".js"
        );
    });

    it("should call fs.rmSync", () => {
        expect(fs.rmSync).toHaveBeenCalled();
    });

    it("should call fs.rmSync with correct path", () => {
        expect(fs.rmSync).toHaveBeenCalledWith(
            CORE_ROOT + "/" + mockCore.coreid + ".js"
        );
    });

    it("should fail if core does not exist", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        const actualResult = deleteCoreFile(mockCore.coreid);
        expect(actualResult).toBe(false);
    });
});

test("createJobObject", () => {
    const expectedResult = createMockJob();

    const tmpJob: Partial<Job> = {
        coreId: expectedResult.coreId,
        taskAmount: expectedResult.taskAmount,
        projectId: expectedResult.projectId,
        taskRequestEndpoint: expectedResult.taskRequestEndpoint,
        taskResultEndpoint: expectedResult.taskResultEndpoint
    };

    const actualResult = createJobObject(tmpJob);

    expect(actualResult.coreId).toBe(expectedResult.coreId);
    expect(actualResult.taskAmount).toBe(expectedResult.taskAmount);
    expect(actualResult.projectId).toBe(expectedResult.projectId);
    expect(actualResult.taskRequestEndpoint).toBe(
        expectedResult.taskRequestEndpoint
    );
    expect(actualResult.taskResultEndpoint).toBe(
        expectedResult.taskResultEndpoint
    );
    expect(typeof actualResult.jobId).toBe(typeof expectedResult.jobId);
});

describe("checkJob", () => {
    const mockJob: Job = createMockJob();
    const mockCore: Core = createMockCore();

    beforeAll(() => {
        jest.resetModules();
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        checkJob(mockJob);
    });

    it("should call fs.existsSync", () => {
        expect(fs.existsSync).toHaveBeenCalled();
    });

    it("should call fs.existsSync with correct path", () => {
        expect(fs.existsSync).toHaveBeenCalledWith(
            CORE_ROOT + "/" + mockJob.coreId + ".js"
        );
    });

    it("should return true if core exists", () => {
        const expectedResult = true;
        expect(checkJob(mockJob)).toBe(expectedResult);
    });

    it("should fail if core does not exist", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        const expectedResult = false;
        const actualResult = checkJob(mockJob);

        expect(actualResult).toBe(expectedResult);
        deleteCoreFile(mockCore.coreid);
    });
});

describe("coreExists", () => {
    const mockCore = createMockCore();

    beforeAll(() => {
        jest.resetModules();
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        coreExists(mockCore.coreid);
    });

    it("should call fs.existsSync", () => {
        expect(fs.existsSync).toHaveBeenCalled();
    });

    it("should call fs.existsSync with correct path", () => {
        expect(fs.existsSync).toHaveBeenCalledWith(
            CORE_ROOT + "/" + mockCore.coreid + ".js"
        );
    });

    it("should return true if core exists", () => {
        const actualResult = coreExists(mockCore.coreid);
        expect(actualResult).toBe(true);
    });

    it("should fail if core does not exist", () => {
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        const actualResult = coreExists(mockCore.coreid);
        expect(actualResult).toBe(false);
    });
});

function createMockCore(): Core {
    const mockCore = {
        coreid: v4() as CoreUUID,
        contents: Buffer.from("function mockCore() { return (1 + 1); }")
    };
    return mockCore;
}

function createMockJob(): Job {
    const mockJob: Job = {
        coreId: v4() as CoreUUID,
        jobId: v4() as JobUUID,
        projectId: v4() as ProjectUUID,
        taskAmount: 1,
        taskRequestEndpoint: "http://localhost:3000/api/task/request",
        taskResultEndpoint: "http://localhost:3000/api/task/result"
    };

    return mockJob;
}
