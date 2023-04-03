import crypto from "crypto";
import fs from "fs";
import { v4 } from "uuid";
import { CoreUUID, JobUUID, ProjectUUID } from "../../types/brand.types";
import { Job, Core } from "../../types/global.types";
import { saveCore } from "../project.controller";
import { CORE_ROOT } from "../../config";
import {
    checkCore,
    createJobObject,
    checkJob,
    deleteCoreFile,
    coreExists
} from "./project.model";

test("checkCore", () => {
    const mockCore: Core = createMockCore();

    const expectedResult = 200;
    const actualResult = checkCore(mockCore);

    expect(actualResult).toBe(expectedResult);
});

test("deleteCoreFile", () => {
    const mockCore: Core = createMockCore();
    saveCore(mockCore);

    deleteCoreFile(mockCore.coreid);
    expect(fs.existsSync(CORE_ROOT + "/" + mockCore.coreid + ".js")).toBe(
        false
    );
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

test("checkJob", () => {
    const mockJob: Job = createMockJob();

    const expectedResult = true;
    const actualResult = checkJob(mockJob);

    expect(actualResult).toBe(expectedResult);
});

test("coreExists", () => {
    const mockCore: Core = createMockCore();

    const expectedResult = true;
    const actualResult = coreExists(mockCore.coreid);

    expect(actualResult).toBe(expectedResult);
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
