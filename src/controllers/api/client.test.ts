import { getSetup } from "./client.controller";
import { Request, Response } from "express";
import projectModel from "../../models/project.model";
import * as UuidModule from "../../utils/random";
import { UUID } from "../../types/brand.types";

describe("test endpoint /api/client/getSetup", () => {
    test("has expected response", () => {
        /* Prepare test environment */
        const req: Partial<Request> = {};
        const res: Partial<Response> = {
            status: jest.fn(() => res as Response),
            send: jest.fn(() => res as Response)
        };

        jest.spyOn(UuidModule, "getId").mockImplementation(() => taskId);

        jest.spyOn(projectModel, "getRandomJob").mockImplementation(
            () => setupMockData[0].jobs[0] as any
        );

        // The contents of PROJECT_DB_PATH do no matter, as our mock implementation is used instead when requesting the JSON file.
        process.env.PROJECT_DB_PATH = "test";

        /* Perform the request */
        getSetup(req as Request, res as Response, jest.fn());

        /* Verify the response */
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.send).toHaveBeenCalledWith(
            JSON.stringify({
                projectId: setupMockData[0].projectId,
                jobId: setupMockData[0].jobs[0].jobId,
                coreId: setupMockData[0].jobs[0].coreId,
                taskId: taskId
            })
        );
    });
});

const taskId = "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e" as UUID;

const setupMockData = [
    {
        projectId: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e",
        jobs: [
            {
                projectId: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e",
                jobId: "1eb9971f-e713-45b9-8584-8e2bc72a386b",
                coreId: "c945fe39-e77e-4b51-a7f4-229bba2ae648",
                taskAmount: 200,
                taskRequstEndpoint:
                    "http://url/to/project/owner/taskRequstEndpoint",
                taskResultEndpoint:
                    "http://url/to/project/owner/taskResultEndpoint"
            }
        ]
    }
];
