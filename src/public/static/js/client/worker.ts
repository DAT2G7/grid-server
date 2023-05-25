/// <reference lib="webworker" />

import { ClientTask } from "../../../../types/body.types";

// Declares type of self,
declare const self: DedicatedWorkerGlobalScope & {
    getData: () => Promise<unknown | never>;
    sendResult: (data: unknown) => Promise<void | never>;
    onDone: () => void;
};

const run = async () => {
    // Get a task from the server
    const response = await fetch("/api/client/setup");
    if (!response.ok) {
        postMessage({
            type: "error",
            message: `Could not fetch setup data: Error ${response.status}`
        });
        close();
        return;
    }

    const setupData: ClientTask = await response.json();
    postMessage({
        type: "terminateSettings",
        setupData: setupData,
        doNotTerminate: false
    });

    // Declare the functions that will be put on the `self` object so the core can access them
    // `getData` is used to fetch the task data from the project server
    const getData: () => Promise<unknown | never> = async () => {
        const response = await fetch(
            `/api/client/project/${setupData.projectId}/job/${setupData.jobId}/task/${setupData.taskId}`
        );
        if (!response.ok) {
            postMessage({
                type: "error",
                message: `Could not fetch task data: Error ${response.status}`
            });
            postMessage({ type: "terminate" });
            close();
            return;
        }

        const data = (await response.json()) as unknown;

        postMessage({
            type: "terminateSettings",
            setupData: setupData,
            doNotTerminate: (
                data as Record<"doNotTerminate", boolean | undefined>
            ).doNotTerminate
        });

        return data;
    };

    // `sendResult` is used to send the calcuted results back to the project server
    const sendResult = async (data: unknown): Promise<void | never> => {
        const options: RequestInit = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        };

        const response = await fetch(
            `/api/client/project/${setupData.projectId}/job/${setupData.jobId}/task/${setupData.taskId}`,
            options
        );
        if (!response.ok) {
            postMessage({
                type: "error",
                message: `Could not return result: Error ${response.status}`
            });
            // we can probably do something smarter than just dying here, but this will do for now
            postMessage({ type: "terminate" });
            close();
            return;
        }
    };

    // `onDone` is used to signal to the client that the core is finished and that the webworker can now safely terminate
    // Separating `onDone` and `sendResult` into two different functions means that the core can send the result and then do some cleanup,
    // like deleting an IndexedDB database before closing
    const onDone: () => void = () => {
        postMessage({ type: "workDone" });
        close();
    };

    // inject our helper functions on the `self` object
    self.getData = getData;
    self.sendResult = sendResult;
    self.onDone = onDone;

    // run the webworker code
    try {
        importScripts(`/api/client/core/${setupData.coreId}`);
    } catch (error) {
        postMessage({ type: "terminate" });
    }
};

// `importScripts` runs synchronously, while `run` is an async function, so `run` will terminate after the call to `importScripts`
run().then(() => {
    postMessage({ type: "setupDone" });
});

// this is insanely stupid, but is forces the typescript compiler to treat this as a CommonJS module,
// which means that it won't generate code that it expects to run in node that crashes when run in the browser
// note that this still causes an error, but since it's at the end of the file, all our work will have started by then so we don't really care
export = {};
