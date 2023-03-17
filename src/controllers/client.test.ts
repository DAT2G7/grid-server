import express, { Express } from "express";
import request from "supertest";
import { renderIndex } from "./client.controller";

import pug from "pug";

// TODO: Potential for duplicate tests.
//        - Should we test the controllers or just the routes?
//        - Is this the correct approach for testing the controller?
describe("Client Controller", () => {
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
        html = pug.renderFile("src/public/views/client/index.pug");
        expect(html).toBeTruthy();
    });

    it("should contain h1 with text 'Grid Server'", async () => {
        // TODO: Find alternative to absolute path
        expect(html).toContain("<h1>Grid Server</h1>");
    });
});

/* Failed mock approach - saved "temporarily" for reference in later attempts (Expires: Fri, 24-03-2022 00:00:00 GMT)

    const mockRequest = {
        body: {}
    } as unknown as Request;

    const res = {
        render: pug.render
    };

    it("should render page", async () => {
        renderIndex(mockRequest, res);
        // ...
    });
*/
