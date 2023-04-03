import { getCore, getSetup, getTask } from "./client.controller";
import { setupMockData } from "./client.test.data";
import { Request, Response, NextFunction } from "express";
import { getMockReq, getMockRes } from "@jest-mock/express";
import path from "path";
import { Job } from "../../types/global.types";
import { TaskUUID } from "../../types/brand.types";
import { ClientTask } from "../../types/body.types";
import { ParamTypes } from "../../types";
import { ParamsDictionary } from "express-serve-static-core";
import * as UuidService from "../../utils/random";
import projectModel from "../../models/project.model";
import config from "../../config";

describe("api/client", () => {
    describe("getSetup", () => {
        let getIdSpy: jest.SpyInstance;
        let getRandomJobSpy: jest.SpyInstance;

        beforeEach(() => {
            getIdSpy = jest.spyOn(UuidService, "getId");
            getRandomJobSpy = jest.spyOn(projectModel, "getRandomJob");
        });

        it("should respond with setup data", () => {
            const req =
                getMockReq<Request<Record<string, never>, ClientTask>>();
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
            const req =
                getMockReq<Request<Record<string, never>, ClientTask>>();
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

    describe("getTask", () => {
        let req: GetTaskRequest;
        let res: Response;
        let next: NextFunction;
        let getJobSpy: jest.SpyInstance;
        let saveSpy: jest.SpyInstance;
        let taskId: TaskUUID;

        const mockTaskData = { test: 100 };

        beforeEach(() => {
            taskId = UuidService.getId();

            req = getMockReq<GetTaskRequest>({
                params: {
                    projectid: setupMockData[0].projectId,
                    jobid: setupMockData[0].jobs[0].jobId,
                    taskid: taskId
                }
            });

            res = getMockRes().res;
            next = getMockRes().next;

            saveSpy = jest.spyOn(projectModel, "save");
            saveSpy.mockImplementation(() => projectModel);

            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve(mockTaskData)
                })
            ) as jest.Mock;
        });

        afterEach(() => {
            jest.restoreAllMocks();
        });

        it("should respond with error if job is not found", async () => {
            req.params.jobid = UuidService.getId();

            await getTask(req, res, next);

            expect(res.sendStatus).toHaveBeenCalledWith(422);
        });

        it("should respond with error if task amount is 0", async () => {
            getJobSpy = jest.spyOn(projectModel, "getJob");
            getJobSpy.mockReturnValue({
                ...setupMockData[0].jobs[0],
                taskAmount: 0
            } as Job);

            await getTask(req, res, next);

            expect(res.sendStatus).toHaveBeenCalledWith(422);

            getJobSpy.mockRestore();
        });

        it("should decrement task amount", async () => {
            const job = {
                ...setupMockData[0].jobs[0]
            } as Job;
            const initialTaskAmount = job.taskAmount;

            getJobSpy = jest.spyOn(projectModel, "getJob");
            getJobSpy.mockReturnValue(job);

            await getTask(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(saveSpy).toHaveBeenCalledTimes(1);
            expect(job.taskAmount).toEqual(initialTaskAmount - 1);
        });

        it("should request task data from project owner", async () => {
            getJobSpy = jest.spyOn(projectModel, "getJob");
            getJobSpy.mockReturnValue({
                ...setupMockData[0].jobs[0]
            } as Job);

            await getTask(req, res, next);
            const fetchRequest =
                setupMockData[0].jobs[0].taskRequestEndpoint + "/" + taskId;

            expect(global.fetch).toHaveBeenCalledWith(fetchRequest);
        });

        it("should respond with task data", async () => {
            getJobSpy = jest.spyOn(projectModel, "getJob");
            getJobSpy.mockReturnValue({
                ...setupMockData[0].jobs[0],
                taskAmount: 100
            } as Job);

            await getTask(req, res, next);

            expect(res.sendStatus).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockTaskData);
        });
    });

    describe("postResult", () => {
        it("should post result to project owner", () => {});
        it("should respond to client with status 200", () => {});
    });
});

type GetCoreRequest = Request<ParamsDictionary & ParamTypes.Core, Buffer>;
type GetTaskRequest = Request<ParamsDictionary & ParamTypes.Task>;
