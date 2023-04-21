/* eslint-disable no-console */ // Allowed in this since SW uses a special console
/// <reference lib="webworker" />

// add correct type to self. Cannot use declare global as it is not allowed outside modules
const _self = self as unknown as ServiceWorkerGlobalScope;

/** Gets the default cache for network ressources */
const getCache = () => caches.open("v1");

/** Adds urls to ressources which should be pre-cached */
const addResourcesToCache = async (resources: string[]) => {
    const cache = await getCache();
    await cache.addAll(resources);
};

/** Puts a ressource to the default cache */
const putInCache = async (request: Request, response: Response) => {
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
    // Attempt cache
    console.log("Attempting cache");
    const fromCache = await caches.match(request);
    if (fromCache) return fromCache;

    // Check URL before attempting network. Dissalow requests to foreign domains
    const url = new URL(request.url);
    if (url.hostname !== self.location.hostname) {
        console.log(
            "Hostname not allowed.\n",
            url.hostname,
            self.location.hostname
        );
        return createErrorResponse(
            "Requesting custom ressources is not allowed, to protect the identities of our users",
            403
        );
    }

    // Attempt network
    console.log("Attempting network");
    try {
        const responseFromNetwork = await fetch(request);
        // Cache response. Cloned as the response can only be consumed once.
        putInCache(request, responseFromNetwork.clone());
        return responseFromNetwork;
    } catch {
        return createErrorResponse("Network error", 408);
    }
};

// Set up pages to be pre-cached
_self.addEventListener("install", (event) => {
    console.log("installing", event);
    event.waitUntil(addResourcesToCache(["/", "/client", "/project"]));
});

// Intercept fetch requests to serve cached resources and block requests to foreign domains
_self.addEventListener("fetch", async (event) => {
    console.log("fetching", event.request.url);
    event.respondWith(cacheFirst(event.request));
});

console.log("service worker loaded");

// const exportMe = "exportMe";
// export { exportMe };
// export {};
// module.exports = {};
