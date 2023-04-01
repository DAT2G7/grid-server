import { getSetup } from "./client.controller";
import { setupMockData } from "./client.test.data";
import { Request } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express";
import { ClientTask } from "../../types/body.types";
import * as uuidService from "../../services/uuid";
import projectModel from "../../models/project.model";

describe("getSetup", () => {
    let getIdSpy: jest.SpyInstance;
    let getRandomJobSpy: jest.SpyInstance;

    beforeEach(() => {
        getIdSpy = jest.spyOn(uuidService, "getId");
        getRandomJobSpy = jest.spyOn(projectModel, "getRandomJob");
    });

    it("will respond with setup data", () => {
        const req = getMockReq<Request<Record<string, never>, ClientTask>>();
        const { res, next } = getMockRes();

        const taskId = uuidService.getId();

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

    it("can handle lack of jobs", () => {
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
