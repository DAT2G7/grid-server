console.log("Client running");

if (window.Worker) {
    console.log("Web worker supported");

    // Create web worker. This way is not ideal, but allows for a simpler build process.
    const worker = new Worker("/static/js/client/worker.js");

    // The ideal would be to use this, but it requires a more complex build process.
    // const worker = new Worker(new URL("./worker.ts", import.meta.url));

    // Listen for messages from worker
    worker.addEventListener("message", (event) => {
        console.log("Message from worker:\n", event);

        // Send message to worker
        worker.postMessage({ type: "message", data: "Hello worker!" });
    });
} else {
    console.log("Web worker not supported");
}

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

registerServiceWorker();
