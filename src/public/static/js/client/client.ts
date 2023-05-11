/// <reference lib="DOM" />

const MAX_TRY_COUNT = 5;

let worker: Worker | null = null;
let tryCount = 0;

let taskCount = 0;

let computeState = false;

const params = new URLSearchParams(window.location.search);
const quiet = params.get("quiet") === "true";
let forceQuiet = false;

const run = async () => {
    // Important to register service worker before starting web worker to ensure core and setup are cached
    await registerServiceWorker();
    runWorker();
};

const runWorker = () => {
    if (!window.Worker) {
        customAlert("Web worker not supported on device.", "danger");
        return;
    }
    if (!computeState) {
        worker?.terminate();
        return;
    }
    // Create web worker. This way is not ideal, but allows for a simpler build process.
    worker = new Worker("/static/js/client/worker.js");

    // Listen for messages from worker
    worker.addEventListener("message", async (event) => {
        switch (event.data.type) {
            // If there is an error with the web worker
            case "error":
                tryCount++;
                worker?.terminate();
                await resetSWCache();

                if (tryCount < MAX_TRY_COUNT) {
                    forceQuiet = true;
                    runWorker();
                } else {
                    // TODO set footer with ref for how to solve problem
                    forceQuiet = false;
                    computeState = false;
                    updateComputeButton();
                }
                break;

            // Web worker telling it's done with its current work
            case "workDone":
                customAlert("Task done! Starting new one.", "success");
                taskCount += 1;
                updateTaskCounter(taskCount.toString());
                tryCount = 0;
                worker?.terminate();
                await resetSWCache();

                // Start new worker, but this time quietly
                forceQuiet = true;
                runWorker();
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

const liveAlertPlaceholder = document.getElementById("liveAlertPlaceholder");
const customAlert = (message: string, type: string) => {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = [
        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
        `   <div>${message}</div>`,
        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
        "</div>"
    ].join("");

    liveAlertPlaceholder?.append(wrapper);
};

const counter = document.getElementById("taskCounter");
if (counter) counter.innerText = "0";
const updateTaskCounter = (taskCounter: string) => {
    if (counter) {
        counter.innerText = taskCounter;
    }
};

window.addEventListener("onload", () => {
    if (quiet) {
        computeState = true;
        run();
    }
    updateComputeButton();
});

const updateComputeButton = () => {
    const computeButton = document.getElementById("computeButton");
    const computeButtonText = document.getElementById("computeButtonText");

    if (!computeButton || !computeButtonText) return;

    if (computeState) {
        computeButtonText.textContent = "Stop computing";
        computeButton.classList.replace("btn-primary", "btn-danger");
    } else {
        computeButtonText.textContent = "Start computing";
        computeButton.classList.replace("btn-danger", "btn-primary");
    }
};

const computeButton = document.getElementById("computeButton");
computeButton?.addEventListener("click", () => {
    computeState = !computeState;
    updateComputeButton();
    run();
});

run();
