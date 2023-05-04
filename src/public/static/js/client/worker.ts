/// <reference lib="webworker" />

import { ClientTask } from "../../../../types/body.types";
import { terminateTask } from "./client";

// Declares type of self,
declare const self: DedicatedWorkerGlobalScope & {
    getData: () => Promise<unknown | never>;
    sendResult: (data: unknown) => Promise<void | never>;
    onDone: () => void;
};

const run = async () => {
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

    const getData: () => Promise<unknown | never> = async () => {
        const response = await fetch(
            `/api/client/project/${setupData.projectId}/job/${setupData.jobId}/task/${setupData.taskId}`
        );
        if (!response.ok) {
            postMessage({
                type: "error",
                message: `Could not fetch task data: Error ${response.status}`
            });
            close();
            return;
        }

        const data = (await response.json()) as unknown;

        if (
            typeof data == "object" &&
            data != null &&
            "doNotTerminate" in data &&
            data.doNotTerminate
        ) {
            self.removeEventListener("beforeunload", () => {
                terminateTask(setupData);
            });
        } else {
            self.addEventListener("beforeunload", () => {
                terminateTask(setupData);
            });
        }

        return data;
    };

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
            close();
            return;
        }
    };

    const onDone: () => void = () => {
        self.removeEventListener("beforeunload", () => {
            terminateTask(setupData);
        });
        postMessage({ type: "workDone" });
        close();
    };

    // inject our helper functions on the `self` object
    self.getData = getData;
    self.sendResult = sendResult;
    self.onDone = onDone;

    // run the webworker code
    importScripts(`/api/client/core/${setupData.coreId}`);
};

run().then(() => {
    postMessage({ type: "setupDone" });
});

// this is insanely stupid, but is forces the typescript compiler to treat this as a CommonJS module,
// which means that it won't generate code that it expects to run in node that crashes when run in the browser
// note that this still causes an error, but since it's at the end of the file, all our work will have started by then so we don't really care
export = {};
