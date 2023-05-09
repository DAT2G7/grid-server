/// <reference lib="DOM" />

const MAX_TRY_COUNT = 5;

let worker: Worker | null = null;
let tryCount = 0;

let taskCount = 0;
let taskCountString = "0";

let computeState = 0;
let newComputeButtonText = "Start computing";

const params = new URLSearchParams(window.location.search);
const quiet = params.get("quiet") === "true";
let forceQuiet = false;

const tryAlert = (message: string) => forceQuiet || quiet || alert(message);
const tryConfirm = (message: string) => forceQuiet || quiet || confirm(message);

const run = () => {
    if (!window.Worker) {
        customAlert("Web worker not supported on device", "danger");
        return;
    }

    if (computeState == 1) {
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
                        customAlert(
                            "Something went wrong with the Web Worker",
                            "danger"
                        );
                    }
                    break;

                // Web worker telling it's done with its current work
                case "workDone":
                    forceQuiet = false;
                    customAlert(
                        "Web Worker task done! Starting new one",
                        "success"
                    );
                    taskCount += 1;
                    taskCountString = taskCount.toString();

                    tryCount = 0;
                    worker?.terminate();

                    // Start new worker, but this time quietly
                    forceQuiet = true;
                    run();
                    break;
            }
        });
    } else {
        worker?.terminate;
        customAlert("Worker terminated", "danger");
    }
};

const computeButton = document.getElementById("computeButton");
computeButton?.addEventListener("click", () => {
    if (computeState === 0) {
        newComputeButtonText = "Stop computing";
        setComputeButtonText(newComputeButtonText);
        computeState = 1;
        run();
    } else if (computeState === 1) {
        newComputeButtonText = "Start computing";
        setComputeButtonText(newComputeButtonText);
        computeState = 0;
        run();
    }
});

//TODO setup something so you can start computing without reloading after pressing no
run();
