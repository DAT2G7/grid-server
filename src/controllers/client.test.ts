import express, { Express, Request, Response } from "express";
import request from "supertest";
import { renderIndex } from "./client.controller";

describe("should render expected views", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {};
        res = {
            render: jest.fn()
        };
    });

    it("index page", () => {
        renderIndex(req as Request, res as Response, jest.fn());

        expect(res.render).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith("client/index");
    });
});

describe("should handle requests", () => {
    let app: Express;

    beforeAll(() => {
        app = express();
        app.set("view engine", "pug");

        // TODO: This path should be defined in a central location.
        app.set("views", "src/public/views");

        app.get("/", renderIndex);
    });

    describe("index page", () => {
        let response: request.Response;

        beforeAll(async () => {
            response = await request(app).get("/");
        });

        it("has successful response code", () => {
            expect(response.status).toBe(200);
        });

        it("has correct content type", () => {
            expect(response.type).toBe("text/html");
        });

        it("has truthy response body", () => {
            expect(response.body).toBeTruthy();
        });
    });
});
