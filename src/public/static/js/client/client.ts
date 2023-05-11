/// <reference lib="DOM" />

const MAX_TRY_COUNT = 5;

let worker: Worker | null = null;
let tryCount = 0;

let taskCount = 0;
let taskCountString = "0";

let computeState = 0;
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

    if (computeState == 1) {
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
                    await resetSWCache();

                    if (tryCount < MAX_TRY_COUNT) {
                        forceQuiet = true;
                        runWorker();
                    } else {
                        // TODO set footer with ref for how to solve problem
                        customAlert(
                            "There is no current work available.",
                            "danger"
                        );
                        computeState = 0;
                        setComputeButtonText("Start computing");
                        setComputeButtonClass(
                            "btn btn-primary btn-lg m-3 bs-danger"
                        );
                    }
                    break;

                // Web worker telling it's done with its current work
                case "workDone":
                    customAlert("Task done! Starting new one.", "success");
                    taskCount += 1;
                    taskCountString = taskCount.toString();
                    tryCount = 0;
                    worker?.terminate();
                    await resetSWCache();

                    // Start new worker, but this time quietly
                    forceQuiet = true;
                    runWorker();
                    break;
            }
        });
    } else {
        worker?.terminate;
    }
};

//TODO setup something so you can start computing without reloading after pressing no
run();
