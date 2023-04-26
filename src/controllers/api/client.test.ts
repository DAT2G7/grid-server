import * as UuidService from "../../utils/random";

import { NextFunction, Request, Response } from "express";
import { getCore, getSetup, getTask, postResult } from "./client.controller";
import { getMockReq, getMockRes } from "@jest-mock/express";

import { ClientTask } from "../../types/body.types";
import { Job } from "../../types/global.types";
import { ParamTypes } from "../../types";
import { ParamsDictionary } from "express-serve-static-core";
import { TaskUUID } from "../../types/brand.types";
import config from "../../config";
import path from "path";
import projectModel from "../../models/project.model";
import { setupMockData } from "./client.test.data";

describe("api/client", () => {
    let res: Response;
    let next: NextFunction;
    let getJobSpy: jest.SpyInstance;
    let taskId: TaskUUID;
    let job: Job;

    beforeEach(() => {
        const mockRes = getMockRes();
        res = mockRes.res;
        next = mockRes.next;

        job = { ...setupMockData[0].jobs[0] };

        getJobSpy = jest.spyOn(projectModel, "getJob").mockReturnValue(job);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

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

            taskId = UuidService.getId();

            getIdSpy.mockReturnValue(taskId);
            getRandomJobSpy.mockReturnValue(setupMockData[0].jobs[0]);

            getSetup(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith({
                projectId: setupMockData[0].projectid,
                jobId: setupMockData[0].jobs[0].jobid,
                coreId: setupMockData[0].jobs[0].coreid,
                taskId: taskId
            });
        });

        it("should handle lack of jobs", () => {
            const req =
                getMockReq<Request<Record<string, never>, ClientTask>>();

            getRandomJobSpy.mockImplementation(() => null);

            getSetup(req, res, next);

            expect(res.sendStatus).toHaveBeenCalledWith(422);
        });
    });

    describe("getCore", () => {
        it("should respond with expected core file", () => {
            const coreId = UuidService.getId();
            const expectedPath = path.resolve(config.CORE_ROOT, coreId + ".js");

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
        const mockTaskData = { test: 100 };

        beforeEach(() => {
            taskId = UuidService.getId();

            req = getMockReq<GetTaskRequest>({
                params: {
                    projectid: setupMockData[0].projectid,
                    jobid: setupMockData[0].jobs[0].jobid,
                    taskid: taskId
                }
            });

            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve(mockTaskData)
                })
            ) as jest.Mock;
        });

        it("should respond with error if job is not found", async () => {
            getJobSpy.mockRestore();
            getJobSpy = jest
                .spyOn(projectModel, "getJob")
                .mockReturnValue(null);

            req.params.jobid = UuidService.getId();

            await getTask(req, res, next);

            expect(res.sendStatus).toHaveBeenCalledWith(422);
        });

        it("should respond with error if task amount is 0", async () => {
            job.taskAmount = 0;

            await getTask(req, res, next);

            expect(res.sendStatus).toHaveBeenCalledWith(422);
        });

        it("should decrement task amount", async () => {
            const initialTaskAmount = job.taskAmount;

            const decrementSpy = jest
                .spyOn(projectModel, "decrementTaskAmount")
                .mockImplementation(() => {
                    job.taskAmount--;
                });

            await getTask(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(decrementSpy).toHaveBeenCalledTimes(1);
            expect(job.taskAmount).toEqual(initialTaskAmount - 1);
        });

        it("should request task data from project owner", async () => {
            await getTask(req, res, next);
            const fetchRequest = `${setupMockData[0].jobs[0].taskRequestEndpoint}?taskid=${taskId}&jobid=${req.params.jobid}&projectid=${req.params.projectid}`;

            expect(global.fetch).toHaveBeenCalledWith(fetchRequest);
        });

        it("should respond with task data", async () => {
            await getTask(req, res, next);

            expect(res.sendStatus).not.toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.send).toHaveBeenCalledWith(mockTaskData);
        });
    });

    describe("postResult", () => {
        let req: PostTaskRequest;

        beforeEach(() => {
            taskId = UuidService.getId();

            req = getMockReq<PostTaskRequest>({
                params: {
                    projectid: setupMockData[0].projectid,
                    jobid: setupMockData[0].jobs[0].jobid,
                    taskid: taskId
                },
                body: {
                    result: "test"
                }
            });

            global.fetch = jest.fn();
        });

        it("should respond with error if the job is not found", () => {
            getJobSpy.mockRestore();
            getJobSpy = jest
                .spyOn(projectModel, "getJob")
                .mockReturnValue(null);

            req.params.jobid = UuidService.getId();

            postResult(req, res, next);

            expect(res.sendStatus).toHaveBeenCalledWith(422);
            expect(global.fetch).not.toHaveBeenCalled();
        });

        it("should post result to project owner", () => {
            const req = getMockReq<PostTaskRequest>({
                params: {
                    projectid: setupMockData[0].projectid,
                    jobid: setupMockData[0].jobs[0].jobid,
                    taskid: taskId
                },
                body: {
                    result: "test"
                }
            });

            postResult(req, res, next);

            expect(global.fetch).toHaveBeenCalledWith(
                `${setupMockData[0].jobs[0].taskResultEndpoint}?taskid=${taskId}&jobid=${req.params.jobid}&projectid=${req.params.projectid}`,
                {
                    method: "POST",
                    body: JSON.stringify(req.body),
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
        });
        it("should respond to client with status 200", async () => {
            await postResult(req, res, next);
            expect(res.sendStatus).toHaveBeenCalledWith(200);
        });
    });
});

type GetCoreRequest = Request<ParamsDictionary & ParamTypes.Core, Buffer>;
type GetTaskRequest = Request<ParamsDictionary & ParamTypes.Task>;
type PostTaskRequest = Request<ParamsDictionary & ParamTypes.Task>;
