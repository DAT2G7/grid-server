import crypto from "crypto";
import fs from "fs";
import { v4 } from "uuid";
import { CoreUUID, JobUUID } from "../../types/brand.types";
import { Core, Job } from "../../types/param.types";
import { saveCore } from "../project.controller";
import { CORE_ROOT } from "../../config";
import {
    checkCore,
    checkJob,
    saveJob,
    readJob,
    deleteCoreFile
} from "./project.model";

test("saveCore", () => {
    const mockCore: Core = createMockCore();

    const hashSum = crypto.createHash("md5");
    hashSum.update(mockCore.contents);

    saveCore(mockCore);

    const corePath: string = CORE_ROOT + "/" + mockCore.coreid + ".js";

    const savedFileContent = fs.readFileSync(corePath);

    const newHashSum = crypto.createHash("md5");
    newHashSum.update(savedFileContent);

    expect(hashSum.digest("hex")).toBe(newHashSum.digest("hex"));
    fs.rmSync(corePath);
});

test("checkCore", () => {
    const mockCore: Core = createMockCore();

    const expectedResult = 200;
    const actualResult = checkCore(mockCore);

    expect(actualResult).toBe(expectedResult);
});

test("saveJob", () => {
    const mockJob: Job = createMockJob();

    saveJob(mockJob);

    const actualJob = readJob(mockJob.jobid);

    expect(actualJob).toBe(mockJob);
});

test("checkJob", () => {
    const mockJob: Job = createMockJob();

    const expectedResult = true;
    const actualResult = checkJob(mockJob);

    expect(actualResult).toBe(expectedResult);
});

test("deleteCore", () => {
    const mockCore: Core = createMockCore();
    saveCore(mockCore);

    deleteCoreFile(mockCore.coreid);
    expect(fs.existsSync(CORE_ROOT + "/" + mockCore.coreid + ".js")).toBe(
        false
    );
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
        coreid: v4() as CoreUUID,
        jobid: v4() as JobUUID,
        contents: Buffer.from(
            "function mockCore(x) { return (x + 1); } \n mockCore(1);"
        )
    };

    return mockJob;
}
