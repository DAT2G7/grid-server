/// <reference lib="DOM" />

const MAX_TRY_COUNT = 5;

let worker: Worker | null = null;
let tryCount = 0;

const params = new URLSearchParams(window.location.search);
let quiet = params.get("quiet") === "true";

const tryAlert = (message: string) => quiet || alert(message);
const tryConfirm = (message: string) => quiet || confirm(message);

const run = () => {
    if (!window.Worker) {
        alert("Web worker not supported on device");
        return;
    }
    const start = tryConfirm("Do you want to start computing?");
    if (!start) {
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
                    worker = new Worker("/static/js/client/worker.js");
                } else {
                    // TODO set footer with ref for how to solve problem
                    tryAlert("Something went wrong in the webworker");
                }
                break;

            // Web worker telling it's done with its current work
            case "workDone":
                tryAlert("Web worker task done! Starting a new one.");
                tryCount = 0;
                worker?.terminate();

                // Start new worker, but this time quietly
                quiet = true;
                run();
                break;
        }
    });
};

//TODO setup something so you can start computing without reloading after pressing no
run();
