import * as UuidService from "../../utils/random";

import { NextFunction, Request, Response } from "express";
import { getCore, getSetup, getTask, postResult } from "./client.controller";
import { getMockReq, getMockRes } from "@jest-mock/express";

import { ClientTask } from "../../types/body.types";
import { Job, Task } from "../../types/global.types";
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

    let getIdSpy: jest.SpyInstance;
    let getRandomJobSpy: jest.SpyInstance;

    beforeEach(() => {
        getIdSpy = jest.spyOn(UuidService, "getId");
        getIdSpy.mockReturnValue("ba5868ea-8e4d-4f50-87ee-c6bd01ad635e");

        getRandomJobSpy = jest.spyOn(projectModel, "getRandomJob");

        const mockRes = getMockRes();
        res = mockRes.res;
        next = mockRes.next;

        job = { ...setupMockData[0].jobs[0] };

        getJobSpy = jest.spyOn(projectModel, "getJob").mockReturnValue(job);
        getJobSpy = jest
            .spyOn(projectModel, "getRandomJob")
            .mockReturnValue(job);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("getSetup", () => {
        it("should respond with setup data", () => {
            const req =
                getMockReq<Request<Record<string, never>, ClientTask>>();

            taskId = UuidService.getId();

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

        it("should decrement task amount", async () => {
            const initialTaskAmount = job.taskAmount;
            const req =
                getMockReq<Request<Record<string, never>, ClientTask>>();

            const decrementSpy = jest
                .spyOn(projectModel, "incrementTaskAmount")
                .mockImplementation(() => {
                    job.taskAmount--;
                });

            getSetup(req, res, next);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(decrementSpy).toHaveBeenCalledTimes(1);
            expect(job.taskAmount).toEqual(initialTaskAmount - 1);
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

        let task: Task | null;

        beforeEach(() => {
            taskId = UuidService.getId();
            task = projectModel.getTask(
                setupMockData[0].projectid,
                setupMockData[0].jobs[0].jobid,
                taskId
            );

            if (task) task.active = true;

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

            global.fetch = jest.fn().mockReturnValue({
                ok: true
            } as unknown as Promise<Response>);
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

        it("should respond to client with status 200", async () => {
            await postResult(req, res, next);
            expect(res.sendStatus).toHaveBeenCalledWith(200);
        });

        it("should post result to project owner", async () => {
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

            await postResult(req, res, next);

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
    });
});

type GetCoreRequest = Request<ParamsDictionary & ParamTypes.Core, Buffer>;
type GetTaskRequest = Request<ParamsDictionary & ParamTypes.Task>;
type PostTaskRequest = Request<ParamsDictionary & ParamTypes.Task>;
