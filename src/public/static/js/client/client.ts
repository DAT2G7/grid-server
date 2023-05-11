/// <reference lib="DOM" />

const MAX_TRY_COUNT = 5;

let worker: Worker | null = null;
let tryCount = 0;

let taskCount = 0;

let computeState = false;
let newComputeButtonText = "Start computing";
let newComputeButtonClass: string;

const params = new URLSearchParams(window.location.search);
const quiet = params.get("quiet") === "true";
let forceQuiet = false;

const tryAlert = (message: string) => forceQuiet || quiet || alert(message);
const tryConfirm = (message: string) => forceQuiet || quiet || confirm(message);

const run = async () => {
    // Important to register service worker before starting web worker to ensure core and setup are cached
    await registerServiceWorker();
    runWorker();
};

const runWorker = () => {
    if (!window.Worker) {
        customAlert("Web worker not supported on device", "danger");
        return;
    }
    if (computeState === false) {
        worker?.terminate();
        return;
    }

    // Create web worker. This way is not ideal, but allows for a simpler build process.
    worker = new Worker("/static/js/client/worker.js");

    // Listen for messages from worker
    worker.addEventListener("message", (event) => {
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
                    forceQuiet = false;
                    computeState = false;
                    customAlert(
                        "There is no current work available.",
                        "danger"
                    );
                    computeState = false;
                    setComputeButtonText("Start computing");
                    setComputeButtonClass(
                        "btn btn-primary btn-lg m-3 bs-danger"
                    );
                }
                break;

            // Web worker telling it's done with its current work
            case "workDone":
                forceQuiet = false;
                customAlert("Task done! Starting new one.", "success");
                taskCount += 1;
                updateCounter(taskCount.toString());
                tryCount = 0;
                worker?.terminate();

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
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};

const resetSWCache = () => {
    if (!navigator.serviceWorker) return;

    const resetDone = new Promise<void>((resolve) => {
        const timeout = setTimeout(() => {
            console.log("Cache reset timed out");
            navigator.serviceWorker.removeEventListener("message", listener);
            resolve();
        }, 5000);

        const listener = (event: MessageEvent) => {
            // Cache was successfully reset
            if (event.data === "RESET_DYNAMIC_CACHE") {
                clearTimeout(timeout);
                resolve();
            }
        };

        navigator.serviceWorker.addEventListener("message", listener, {
            once: true
        });
    });

    navigator.serviceWorker.controller?.postMessage("RESET_DYNAMIC_CACHE");

    return resetDone;
};

window.addEventListener("load", () => {
    if (computeState === true) run();
});

const computeButton = document.getElementById("computeButton");
computeButton?.addEventListener("click", () => {
    if (computeState === false) {
        newComputeButtonText = "Stop computing";
        setComputeButtonText(newComputeButtonText);
        setComputeButtonClass("btn btn-danger btn-lg m-3 bs-danger");
        computeState = true;
        run();
    } else if (computeState === true) {
        newComputeButtonText = "Start computing";
        setComputeButtonText(newComputeButtonText);
        setComputeButtonClass("btn btn-primary btn-lg m-3 bs-danger");
        computeState = false;
        run();
    }
});

//TODO setup something so you can start computing without reloading after pressing no
run();
