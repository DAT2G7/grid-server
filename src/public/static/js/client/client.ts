/// <reference lib="DOM" />

const MAX_TRY_COUNT = 5;

let worker: Worker | null = null;
let tryCount = 0;

let doNotTerminate = false;
let setupData: any;

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
        terminateTask();
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
                    customAlert("No work available", "danger");
                    updateComputeButton();
                }
                break;

            // Web worker telling it's done with its current work
            case "workDone":
                if (!forceQuiet)
                    customAlert("Task done! Starting new one.", "success");
                taskCount += 1;
                updateTaskCounter(taskCount.toString());
                tryCount = 0;
                worker?.terminate();
                await resetSWCache();

                //do not terminate if the task is not running
                doNotTerminate = true;

                // Start new worker, but this time quietly
                forceQuiet = true;
                runWorker();
                break;

            case "terminateSettings":
                setupData = event.data.setupData;
                doNotTerminate = event.data.doNotTerminate;
                break;

            case "terminate":
                terminateTask();
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

const terminateTask = () => {
    if (!setupData || doNotTerminate) return;
    let { projectId, jobId, taskId } = setupData;
    console.log("Terminating task: ", taskId);
    navigator.sendBeacon(
        `/api/client/terminate/project/${projectId}/job/${jobId}/task/${taskId}`
    );
};

window.addEventListener("beforeunload", () => {
    terminateTask();
    resetSWCache();
});

// Makes a constant from the element of liveAlertPlaceholder in the HTML
const liveAlertPlaceholder = document.getElementById("liveAlertPlaceholder");
const customAlert = (message: string, type: string) => {
    // Creates a element in HTML file
    const wrapper = document.createElement("div");
    // Adds element with function parameters being message and type.
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

// When loading window, if it's already told to start computing it will do so,
// aswell as set the initial text for the compute button
window.onload = () => {
    if (quiet) {
        computeState = true;
        run();
    }
    updateComputeButton();
};

// Function for updating how the compute button looks
const updateComputeButton = () => {
    const computeButton = document.getElementById("computeButton");
    const computeButtonText = document.getElementById("computeButtonText");

    // Simple null check
    if (!computeButton || !computeButtonText) return;

    // Sets the visual of the compute button based on compute state
    if (computeState) {
        computeButtonText.textContent = "Stop computing";
        computeButton.classList.replace("btn-primary", "btn-danger");
    } else {
        computeButtonText.textContent = "Start computing";
        computeButton.classList.replace("btn-danger", "btn-primary");
    }
};

const computeButton = document.getElementById("computeButton");
//Event listener for when the computeButton is clicked
computeButton?.addEventListener("click", () => {
    // Changes the compute state, runs update and run function
    computeState = !computeState;
    updateComputeButton();
    run();
});

run();
