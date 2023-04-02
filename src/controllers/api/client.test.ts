import { getCore, getSetup } from "./client.controller";
import { setupMockData } from "./client.test.data";
import { Request } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express";
import path from "path";
import { ClientTask } from "../../types/body.types";
import { ParamTypes } from "../../types";
import { ParamsDictionary } from "express-serve-static-core";
import * as UuidService from "../../utils/random";
import projectModel from "../../models/project.model";
import { UUID } from "../../types/brand.types";
import config from "../../config";

describe("getSetup", () => {
    let getIdSpy: jest.SpyInstance;
    let getRandomJobSpy: jest.SpyInstance;

    beforeEach(() => {
        getIdSpy = jest.spyOn(UuidService, "getId");
        getRandomJobSpy = jest.spyOn(projectModel, "getRandomJob");
    });

    it("should respond with setup data", () => {
        const req = getMockReq<Request<Record<string, never>, ClientTask>>();
        const { res, next } = getMockRes();

        const taskId = UuidService.getId();

        getIdSpy.mockReturnValue(taskId);
        getRandomJobSpy.mockReturnValue(setupMockData[0].jobs[0]);

        getSetup(req, res, next);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith({
            projectId: setupMockData[0].projectId,
            jobId: setupMockData[0].jobs[0].jobId,
            coreId: setupMockData[0].jobs[0].coreId,
            taskId: taskId
        });
    });

    it("should handle lack of jobs", () => {
        const req = getMockReq<Request<Record<string, never>, ClientTask>>();
        const { res, next } = getMockRes();

        getRandomJobSpy.mockImplementation(() => null);

        expect(() => {
            getSetup(req, res, next);
        }).toThrowError();

        expect(res.status).toHaveBeenCalledWith(500);
    });

    afterEach(() => {
        getIdSpy.mockRestore();
        getRandomJobSpy.mockRestore();
    });
});

type GetCoreRequest = Request<ParamsDictionary & ParamTypes.Core, Buffer>;

describe("getCore", () => {
    it("should respond with expected core file", () => {
        const coreId = UuidService.getId();
        const expectedPath = path.resolve(config.CORE_ROOT, coreId + ".js");

        const { res, next } = getMockRes();
        const req = getMockReq<GetCoreRequest>({
            params: {
                coreid: coreId
            }
        });

        getCore(req, res, next);

        expect(res.sendFile).toHaveBeenCalledWith(expectedPath);
    });
});
