const MAX_TRY_COUNT = 5;
import Swal from "sweetalert2";

let worker: Worker | null = null;
let tryCount = 0;

//TODO setup something so you can start computing without reloading after pressing no
Swal.fire({
    title: "Do you want to start computing?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes"
}).then((result) => {
    if (result.isConfirmed)
        if (window.Worker) {
            // Create web worker. This way is not ideal, but allows for a simpler build process.
            worker = new Worker("/static/js/client/worker.js");

            // Listen for messages from worker
            worker.addEventListener("message", (event) => {
                switch (event.data.type) {
                    case "error":
                        // TODO: better communication with the user
                        console.error(
                            "Something went wrong while running the web worker:",
                            event.data.message
                        );

                        tryCount++;
                        worker?.terminate();
                        if (tryCount < MAX_TRY_COUNT) {
                            worker = new Worker("/static/js/client/worker.js");
                        } else {
                            console.error(
                                `Could not finish work after ${MAX_TRY_COUNT} attempts. No more workers will be created until the site is refreshed`
                            );
                            // swal alert when error with web worker.
                            // TODO set footer with ref for how to solve problem
                            Swal.fire({
                                icon: "error",
                                title: "Error with web worker",
                                text: event.data.message
                            });
                        }
                        break;
                    case "workDone":
                        Swal.fire("Web worker task done! Starting a new one.");
                        console.log(
                            "Web worker is done running! Starting a new one."
                        );
                        tryCount = 0;
                        worker?.terminate();
                        worker = new Worker("/static/js/client/worker.js");
                        break;
                }
            });
        } else {
            console.log("Web worker not supported");
            Swal.fire("Web worker not supported on device");
        }
});
