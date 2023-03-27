import { getSetup } from "./client.controller";
import fs from "fs";
import { Request, Response } from "express";

describe("test endpoint /api/client/getSetup", () => {
    test("has expected response", () => {
        process.env.PROJECT_DB_PATH = "test";

        jest.spyOn(fs, "readFileSync").mockImplementation(() =>
            JSON.stringify(setupMockData)
        );

        let req: Partial<Request> = {};
        let res: Partial<Response> = {
            status: jest.fn(() => res as Response),
            send: jest.fn(() => res as Response)
        };

        getSetup(req as Request, res as Response, jest.fn());

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.send).toHaveBeenCalledWith(
            JSON.stringify({
                projectId: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e",
                jobId: "5eb9971f-e713-45b9-8584-8e2bc72a386b"
            })
        );
    });
});

const setupMockData = [
    {
        projectId: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e",
        jobs: [
            {
                jobId: "5eb9971f-e713-45b9-8584-8e2bc72a386b",
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
