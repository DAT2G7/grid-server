/// <reference lib="DOM" />

const MAX_TRY_COUNT = 5;

let worker: Worker | null = null;
let tryCount = 0;

const params = new URLSearchParams(window.location.search);
const quiet = params.get("quiet") === "true";
let forceQuiet = false;

const tryAlert = (message: string) => forceQuiet || quiet || alert(message);
const tryConfirm = (message: string) => forceQuiet || quiet || confirm(message);

const run = async () => {
    // Important to register service worker before starting web worker to ensure core and setup are cached
    await registerServiceWorker();

    if (!window.Worker) {
        alert("Web worker not supported on device");
        return;
    }

    //TODO setup something so you can start computing without reloading after pressing no
    const start = tryConfirm("Do you want to start computing?");
    if (!start) {
        return;
    }
    // Create web worker. This way is not ideal, but allows for a simpler build process.
    worker = new Worker("/static/js/client/worker.js");

    // Listen for messages from worker
    worker.addEventListener("message", async (event) => {
        switch (event.data.type) {
            // If there is an error with the web worker
            case "error":
                // TODO: better communication with the user
                tryCount++;
                worker?.terminate();
                if (tryCount < MAX_TRY_COUNT) {
                    forceQuiet = true;
                    run();
                } else {
                    // TODO set footer with ref for how to solve problem
                    resetSWCache();
                    forceQuiet = false;
                    tryAlert("Something went wrong in the webworker");
                }
                break;

            // Web worker telling it's done with its current work
            case "workDone":
                tryAlert("Web worker task done! Starting a new one.");
                tryCount = 0;
                worker?.terminate();
                await resetSWCache();

                // Start new worker, but this time quietly
                forceQuiet = true;
                run();
                break;
        }
    });
};

//? If possible i would like for the logging statements below to remain as SWs can be tricky, even in production
const registerServiceWorker = async () => {
    if (navigator.serviceWorker) {
        try {
            const registration = await navigator.serviceWorker.register(
                "/service-worker.js"
            );
            if (registration.installing) {
                console.log("Service worker installing");
            } else if (registration.waiting) {
                console.log("Service worker installed");
            } else if (registration.active) {
                console.log("Service worker active");
            }

            // When service worker is installed and active, send request which should be blocked
            await navigator.serviceWorker.ready;
            console.log("sw:", navigator.serviceWorker.controller);

            // TODO: Find a better way to ensure this than reloading the page
            // TODO: Should also have error handling to avoid infinite reload. This has never been observed but seems a theoretical possibility
            if (!navigator.serviceWorker.controller)
                window.location.href =
                    window.location.href + "?_=" + Date.now();

            // TODO: Remove this once SW has been properly integrated and tested
            setTimeout(() => {
                console.log("Attempting foreign fetch");
                fetch("https://get.geojs.io/v1/ip/country.json?ip=8.8.8.8")
                    .then((response) => {
                        console.log("fetch status:", response.status);
                    })
                    .catch((e) => console.error("fetch error:", e));
            }, 3000);
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};

const resetSWCache = () => {
    const resetDone = new Promise<void>((resolve) =>
        navigator.serviceWorker.addEventListener(
            "message",
            (event) => {
                // Give up after 30 seconds
                setTimeout(resolve, 30000);

                // Cache was successfully reset
                if (event.data === "RESET_DYNAMIC_CACHE") resolve();
            },
            { once: true }
        )
    );

    navigator.serviceWorker.controller?.postMessage("RESET_DYNAMIC_CACHE");

    return resetDone;
};

run();
