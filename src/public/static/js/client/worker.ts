import { UUID } from "../../../../types/brand.types";

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

    // TODO: this should be put in a type of its own
    // TODO: it looks like the /api/client/setup endpoint doens't return any core id, so we don't know how to get that
    // also, we don't get a task id, so we can't fetch our data
    // for now we'll just assume that we get that data back, and this is gonna be broken until it's fixed
    const setupData: {
        projectId: UUID;
        jobId: UUID;
        coreId: UUID;
        taskId: UUID;
    } = await response.json();

    const getData: () => Promise<unknown | never> = async () => {
        const response = await fetch(
            `/api/client/core/${setupData.coreId}/job/${setupData.jobId}/task/${setupData.taskId}`
        );
        if (!response.ok) {
            postMessage({
                type: "error",
                message: `Could not fetch task data: Error ${response.status}`
            });
            close();
            return;
        }

        return (await response.json()) as unknown;
    };

    const sendResult: (data: unknown) => Promise<void | never> = async () => {
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        };

        const response = await fetch(
            `/api/client/core/${setupData.coreId}/job/${setupData.jobId}/task/${setupData.taskId}`,
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

    // supressses the unused variable warnings, since the functions are meant to be used by the core code :3
    getData;
    sendResult;

    // run the webworker code
    importScripts(`/core/${setupData.coreId}`);
};

run().then(() => {
    postMessage({ type: "done" });
});

//async function getData() : Promise<unknown> {
//  return fetch("/
//}
