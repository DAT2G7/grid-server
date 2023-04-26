/// <reference lib="DOM" />

const MAX_TRY_COUNT = 5;

let worker: Worker | null = null;
let tryCount = 0;

const run = async () => {
    // Important to register service worker before starting web worker to ensure core and setup are cached
    await registerServiceWorker();

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
            // If there is an error with the web worker
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

            // Web worker telling it's done with its current work
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

const registerServiceWorker = async () => {
    if (navigator.serviceWorker) {
        try {
            // const registration = await navigator.serviceWorker.register(
            //     "/static/js/service-worker.js",
            //     {
            //         scope: "/static/js/"
            //     }
            // );
            const registration = await navigator.serviceWorker.register(
                "/service-worker.js"
                // {
                //     scope: "/"
                // }
            );
            if (registration.installing) {
                console.log("Service worker installing");

                const installingWorker = registration.installing;
                await new Promise<void>((resolve, reject) => {
                    installingWorker.onstatechange = () => {
                        if (installingWorker.state === "installed") {
                            resolve();
                        }
                    };

                    // Resolve even though it failed, as there is no error handling to be done.
                    setTimeout(reject, 30000);
                })
                    .then(() => console.log("Service worker installed"))
                    .catch(() =>
                        console.warn("Service worker failed to install")
                    );
            } else if (registration.waiting) {
                console.log("Service worker installed");
            } else if (registration.active) {
                console.log("Service worker active");
            }
            setTimeout(() => {
                console.log("Attempting foreign fetch");
                fetch("https://get.geojs.io/v1/ip/country.json?ip=8.8.8.8")
                    .then((response) => {
                        console.log("sw:", navigator.serviceWorker.controller);
                        console.log("fetch status:", response.status);
                    })
                    .catch((e) => console.error("fetch error:", e));
            }, 10000);
        } catch (error) {
            console.error(`Registration failed with ${error}`);
        }
    }
};

run();
