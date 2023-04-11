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
    if (!result.isConfirmed) {
        return;
    }
    if (!window.Worker) {
        Swal.fire("Web worker not supported on device");
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
                tryCount = 0;
                worker?.terminate();
                worker = new Worker("/static/js/client/worker.js");
                break;
        }
    });
});
