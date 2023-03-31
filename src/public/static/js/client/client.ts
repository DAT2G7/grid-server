const MAX_TRY_COUNT = 5;

let worker: Worker | null = null;
let tryCount = 0;

if (window.Worker) {
    // Create web worker. This way is not ideal, but allows for a simpler build process.
    worker = new Worker('/static/js/client/worker.js');

    // Listen for messages from worker
    worker.addEventListener('message', (event) => {
        switch (event.data.type) {
            case "error":
                // TODO: better error handling
                console.error("Something went wrong while running the web worker:", event.data.message);
                tryCount++;
                worker?.terminate();
                if (tryCount < MAX_TRY_COUNT) {
                    worker = new Worker('/static/js/client/worker.js');
                } else {
                    console.error(`Could not finish work after ${MAX_TRY_COUNT} attempts. No more workers will be created until the site is refreshed`);
                }
                break;
            case "workDone":
                console.log("Web worker is done running! Starting a new one.");
                tryCount = 0;
                worker?.terminate();
                worker = new Worker('/static/js/client/worker.js');
                break;
        }
    });
} else {
    console.log('Web worker not supported');
}
