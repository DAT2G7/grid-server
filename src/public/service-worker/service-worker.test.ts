import makeServiceWorkerEnv from "service-worker-mock";

declare const self: WorkerGlobalScope;

describe("Service worker", () => {
    // Mock service worker environment before each test
    beforeEach(() => {
        Object.assign(global, makeServiceWorkerEnv());
        jest.resetModules();
    });

    it("should add listeners", () => {
        require("./service-worker.ts");
        expect(self.listeners.get("install")).toBeDefined();
        expect(self.listeners.get("fetch")).toBeDefined();
        expect(self.listeners.get("message")).toBeDefined();
    });

    //! Tests for actual work is not working
});
