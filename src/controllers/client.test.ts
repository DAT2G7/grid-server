import express, { Express, Request, Response } from "express";
import request from "supertest";
import { renderIndex } from "./client.controller";

import pug from "pug";

describe("Client Controller (mock test)", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;

    beforeEach(() => {
        req = {};
        res = {
            render: jest.fn()
        };
    });

    it("should render index page", () => {
        renderIndex(req as Request, res as Response, () => {
            /* */
        });

        expect(res.render).toHaveBeenCalled();
        expect(res.render).toHaveBeenCalledWith("client/index");
    });
});

// TODO: Is this the correct approach for testing the controller?
//        - Should this be a router / endpoint test instead?
describe("Client Controller (full test)", () => {
    // TODO: Consider grabbing preconfigured express instance from app.ts instead.
    let app: Express;

    beforeAll(() => {
        app = express();
        app.set("view engine", "pug");
        app.set("views", "src/public/views"); // TODO: This path should be defined elsewhere.
        app.get("/", renderIndex);
    });

    describe("Render index", () => {
        let response: request.Response;

        beforeAll(async () => {
            response = await request(app).get("/");
        });

        it("should return valid response", () => {
            expect(response.status).toBe(200);
            expect(response.type).toBe("text/html");
        });

        it("should contain h1 with text 'Grid Server'", () => {
            expect(response.text).toContain("<h1>Grid Server</h1>");
        });
    });
});

// TODO: Decide usefulness and either remove or move to proper location
//          Suggested location: src/public/views/client/index.test.ts
describe("Client index view", () => {
    let html: string;
    it("should render view", () => {
        // TODO: Find alternative to absolute path
        html = pug.renderFile("src/public/views/client/index.pug");
        expect(html).toBeTruthy();
    });

    it("should contain h1 with text 'Grid Server'", async () => {
        expect(html).toContain("<h1>Grid Server</h1>");
    });
});
