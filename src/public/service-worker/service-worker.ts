/// <reference lib="webworker" />

//? Console is allowed in this since SW uses a special console only visible through special tools
/* eslint-disable no-console */

// add correct type to self. Cannot use declare global as it is not allowed outside modules
const _self = self as unknown as ServiceWorkerGlobalScope;

enum CacheKeys {
    Dynamic = "dynamic.v1",
    Precache = "precache.v1"
}

enum CacheMode {
    Cache = "cache",
    Network = "network"
}

// Set mode to CacheMode.Network to disable caching entirely. Should only be used for debugging.
const MODE = CacheMode.Cache;

/** Gets the default cache for network ressources */
const getCache = () => caches.open(CacheKeys.Dynamic);
const getPreCache = () => caches.open(CacheKeys.Precache);

/** Adds urls to ressources which should be pre-cached */
const addResourcesToCache = async (resources: string[]) => {
    const cache = await getPreCache();
    await cache.addAll(resources);
};

/** Puts a ressource to the default cache */
const putInCache = async (request: Request, response: Response) => {
    if (request.method !== "GET") return;
    const cache = await getCache();
    await cache.put(request, response);
};

/** Ensures uniform response formatting */
const createErrorResponse = (message: string, status: number) =>
    new Response(JSON.stringify({ error: { message } }), {
        status,
        headers: {
            "Content-Type": "application/json"
        }
    });

/** Attempts to get cached response. Otherwise fetches network ressource */
const cacheFirst = async (request: Request): Promise<Response> => {
    if (MODE === CacheMode.Cache) {
        // Attempt cache
        const fromCache = await caches.match(request);
        if (fromCache) {
            return fromCache;
        }

        // Check URL before attempting network. Dissalow requests to foreign domains
        const url = new URL(request.url);
        if (url.hostname !== self.location.hostname) {
            console.warn(
                "Hostname not allowed.\n",
                url.hostname,
                self.location.hostname
            );
            return createErrorResponse(
                "Requesting custom ressources is not allowed, to protect the identities of our users",
                403
            );
        }
    }
    try {
        const responseFromNetwork = await fetch(request);
        // Cache response. Cloned as the response can only be consumed once.

        putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch {
        return createErrorResponse("Network error", 408);
    }
};

const precacheResources = () =>
    addResourcesToCache([
        "/",
        "/client",
        "/project",
        "/static/js/client/client.js",
        "/static/js/client/worker.js"
    ]);

// Set up pages to be pre-cached
_self.addEventListener("install", (event) => {
    console.log("installing", event);
    event.waitUntil(precacheResources());
});

// Intercept fetch requests to serve cached resources and block requests to foreign domains
_self.addEventListener("fetch", async (event) => {
    console.log("fetching", event.request.url);
    event.respondWith(cacheFirst(event.request));
});

_self.addEventListener("message", async (event) => {
    console.log("message:", event);
    if (event.data === "RESET_DYNAMIC_CACHE") {
        await caches.delete(CacheKeys.Dynamic);
        event.source?.postMessage("RESET_DYNAMIC_CACHE");
    }
});

console.log("service worker loaded in mode:", MODE);

//! Expose functions for testing. Cannot be exported as current compiler configuration breaks SW if it's a module
const testSelf = self as unknown as Record<string, unknown>;
testSelf["getCache"] = getCache;
testSelf["getPreCache"] = getPreCache;
testSelf["addResourcesToCache"] = addResourcesToCache;
testSelf["putInCache"] = putInCache;
testSelf["createErrorResponse"] = createErrorResponse;
testSelf["cacheFirst"] = cacheFirst;
testSelf["precacheResources"] = precacheResources;
testSelf["MODE"] = MODE;
