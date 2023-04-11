import makeFetchMock from "service-worker-mock/fetch";
import makeServiceWorkerEnv from "service-worker-mock";

// Hack self type to fit testing library. Not exhaustive
// interface Self {
//     addEventListener: (
//         type: string,
//         listener: (event: unknown) => void
//     ) => void;
//     trigger: (type: string, event?: unknown) => Promise<void>;
//     listeners: Map<string, (event: unknown) => void>;
// }

declare const self: WorkerGlobalScope;

describe("Service worker", () => {
    // Mock service worker environment before each test
    beforeEach(() => {
        Object.assign(global, makeServiceWorkerEnv(), makeFetchMock());
        // Object.assign(global, makeServiceWorkerEnv());
        jest.resetModules();
    });

    it("should add listeners", () => {
        require("./service-worker.ts");
        expect(self.listeners.get("install")).toBeDefined();
        // expect(self.listeners.get("activate")).toBeDefined();
        expect(self.listeners.get("fetch")).toBeDefined();
    });

    it("should block requests to foreign domains", async () => {
        require("./service-worker.ts");
        const response = await fetch("https://example.com");
        expect(response.status).toBe(403);
    });
});

// describe("Service worker 2", () => {
//     // Mock service worker environment before each test
//     beforeEach(() => {
//         const serviceWorkerEnv = makeServiceWorkerEnv();
//         Object.defineProperty(serviceWorkerEnv, "addEventListener", {
//             value: (
//                 serviceWorkerEnv as unknown as {
//                     addEventListener: Self["addEventListener"];
//                 }
//             ).addEventListener,
//             enumerable: true
//         });
//         Object.assign(global, serviceWorkerEnv);
//         jest.resetModules();
//     });

//     it("should add listeners", async () => {
//         // require("./service-worker");
//         // await self.trigger("install");
//         // expect(self.listeners.get("install")).toBeDefined();
//         // expect(self.listeners.get("fetch")).toBeDefined();
//         expect(1).toBe(1);
//     });
// });
