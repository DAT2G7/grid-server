/// <reference lib="DOM" />

const MAX_TRY_COUNT = 5;

let worker: Worker | null = null;
let tryCount = 0;

const run = () => {
    if (!window.Worker) {
        alert("Web worker not supported on device");
        return;
    }
    const start = confirm("Do you want to start computing?");
    if (!start) {
        return;
    }
    // Create web worker. This way is not ideal, but allows for a simpler build process.
    worker = new Worker("/static/js/client/worker.js");

    // Listen for messages from worker
    worker.addEventListener("message", (event) => {
        switch (event.data.type) {
            case "error":
                // TODO: better communication with the user
                tryCount++;
                worker?.terminate();
                if (tryCount < MAX_TRY_COUNT) {
                    worker = new Worker("/static/js/client/worker.js");
                } else {
                    // TODO set footer with ref for how to solve problem
                    alert("Something went wrong in the webworker");
                }
                break;
            case "workDone":
                alert("Web worker task done! Starting a new one.");
                tryCount = 0;
                worker?.terminate();
                worker = new Worker("/static/js/client/worker.js");
                break;
        }
    });
};
//TODO setup something so you can start computing without reloading after pressing no
run();
