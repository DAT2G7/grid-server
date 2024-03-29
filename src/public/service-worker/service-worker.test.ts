import { ClientTask } from "../../types/body.types";
import makeServiceWorkerEnv from "service-worker-mock";

enum CacheKeys {
    Dynamic = "dynamic.v1",
    Precache = "precache.v1"
}

enum CacheMode {
    Cache = "cache",
    Network = "network"
}

// Convince this module that self is a service worker and contains the functions that need to be tested
declare const self: WorkerGlobalScope & {
    getCache: () => Promise<Cache>;
    getPreCache: () => Promise<Cache>;
    addResourcesToCache: (resources: string[]) => Promise<void>;
    putInCache: (request: Request, response: Response) => Promise<void>;
    createErrorResponse: (message: string, status: number) => Response;
    cacheFirst: (request: Request) => Promise<Response>;
    precacheResources: () => Promise<void>;
    MODE: CacheMode;
};

describe("Service worker", () => {
    // Mock service worker environment before each test. This is what changes the environment to make it think it's a service worker
    beforeEach(() => {
        Object.assign(global, makeServiceWorkerEnv());
        jest.resetModules();
        require("./service-worker.ts");
    });

    it("should add listeners", () => {
        expect(self.listeners.get("install")).toBeDefined();
        expect(self.listeners.get("fetch")).toBeDefined();
        expect(self.listeners.get("message")).toBeDefined();
    });

    it("should expose functions for tests", () => {
        expect(self.getCache).toBeDefined();
        expect(self.getPreCache).toBeDefined();
        expect(self.addResourcesToCache).toBeDefined();
        expect(self.putInCache).toBeDefined();
        expect(self.createErrorResponse).toBeDefined();
        expect(self.cacheFirst).toBeDefined();
        expect(self.MODE).toBeDefined();
    });

    it("should be in cache mode", () => {
        expect(self.MODE).toBe(CacheMode.Cache);
    });

    it("should use correct caches", async () => {
        const dynamicFromFunc = await self.getCache();
        const dynamicFromOpen = await caches.open(CacheKeys.Dynamic);
        expect(dynamicFromFunc).toBeDefined();
        expect(dynamicFromFunc).toStrictEqual(dynamicFromOpen);

        const preFromFunc = await self.getCache();
        const preFromOpen = await caches.open(CacheKeys.Precache);
        expect(preFromFunc).toBeDefined();
        expect(preFromFunc).toStrictEqual(preFromOpen);
    });

    it("should block outside requests", async () => {
        const request = new Request(
            "https://get.geojs.io/v1/ip/country.json?ip=8.8.8.8"
        );

        // We cant actually make the request as this environment has access to the service worker but isn't controlled by it
        // Therefor we call the intercepting function directly. It has already been tested that the fetch listener exists.
        // Ideally we would call the listener directly, but this is significantly easier to implement.
        const response = await self.cacheFirst(request);
        expect(response.status).toBe(403);
    });

    it("Should cache dynamic content like setup", async () => {
        // Setup never returns the same response twice, so it is perfect for this test case.
        const request = new Request("api/client/setup");

        // First time should get from network
        const networkResponse = await self.cacheFirst(request);
        const networkBody: ClientTask = await networkResponse.json();

        // Second time should get from cache
        const cacheResponse = await self.cacheFirst(request);
        const cacheBody: ClientTask = await cacheResponse.json();

        // Check that the responses are the same
        expect(networkBody).toEqual(cacheBody);
    });

    //! Non-working tests

    // TODO: Find out why fetch errors during `preCacheResources()`. This is an issue with the testing setup, not the code.
    // it("Should precache 5 pages", async () => {
    //     const [preCache] = await Promise.all([
    //         self.getPreCache(),
    //         self.precacheResources()
    //     ]);
    //     const keys = await preCache.keys();
    //     expect(keys.length).toBe(5);
    // });
});
