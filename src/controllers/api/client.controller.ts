import { ClientTask } from "../../types/body.types";
import { ParamTypes } from "../../types";
import { RequestHandler } from "express";
import { TaskUUID } from "../../types/brand.types";
import config from "../../config";
import db from "../../models/project.model";
import { getId } from "../../utils/random";
import path from "path";

/**
 * Serve core-, job- and task-id
 */
export const getSetup: RequestHandler<Record<string, never>, ClientTask> = (
    _req,
    res
) => {
    const job = db.getRandomJob();

    // The `job` is null if there is no available work on the grid.
    if (!job) {
        res.sendStatus(422);
        return;
    }

    const { projectid, jobid } = job;
    let taskId: TaskUUID;

    // Retrieve a failed task if available, otherwise create a new task.
    if (job.failedTaskAmount > 0) {
        taskId = db.getFailedTaskId(projectid, jobid) as TaskUUID;

        db.incrementFailedTaskAmount(projectid, jobid, -1);
        db.setTaskIsFailed(projectid, jobid, taskId, false);
    } else {
        // Generate a completely new task UUID, as we are creating a new task.
        taskId = getId();

        db.incrementTaskAmount(projectid, jobid, -1);
        db.addNewTask(projectid, jobid, taskId);
    }

    const responseData: ClientTask = {
        projectId: projectid,
        jobId: jobid,
        coreId: job.coreid,
        taskId: taskId
    };

    // Express automatically converts objects to JSON and sends it with the correct content type.
    res.status(200).send(responseData);
};

/**
 * Serve core
 */
export const getCore: RequestHandler<ParamTypes.Core, Buffer> = (_req, res) => {
    const { coreid } = _req.params;
    res.sendFile(path.resolve(config.CORE_ROOT, coreid + ".js"));
};

/**
 * Retrieve and serve task data
 */
export const getTask: RequestHandler<ParamTypes.Task> = async (req, res) => {
    const { projectid, jobid, taskid } = req.params;
    const job = db.getJob(projectid, jobid);

    // `job` is null if the client attempts to retrieve a job that does not exist.
    if (!job) {
        res.sendStatus(422);
        return;
    }

    let taskData: unknown;
    // The `try` block may throw an error due to network failure
    // or if the project server does not respond with valid JSON.
    try {
        taskData = await (
            await fetch(
                `${job.taskRequestEndpoint}?taskid=${taskid}&jobid=${jobid}&projectid=${projectid}`
            )
        ).json();
    } catch (error) {
        console.log(error);

        // If we did not receive valid task data from the project server,
        // the task is marked as failed and an error status code is sent to the client.
        db.incrementFailedTaskAmount(projectid, jobid, 1);
        db.setTaskIsFailed(projectid, jobid, taskid, true);
        res.sendStatus(500);

        // Stop further execution, we have already sent a response.
        return;
    }

    res.status(200).send(taskData);
};

/**
 * Post result to project owner
 */
export const postResult: RequestHandler<ParamTypes.Task> = async (req, res) => {
    const { projectid, jobid, taskid } = req.params;
    const job = db.getJob(projectid, jobid);

    // `job` is null if the client attempts to retrieve a job that does not exist.
    if (!job) {
        res.sendStatus(422);
        return;
    }

    // TODO: Better error handling (promise chain)
    try {
        // Relay the result to the appropriate project server endpoint.
        const projectResponse = await fetch(
            `${job.taskResultEndpoint}?taskid=${taskid}&jobid=${jobid}&projectid=${projectid}`,
            {
                method: "POST",
                body: JSON.stringify(req.body),
                headers: {
                    "Content-Type":
                        req.headers["content-type"] || "application/json"
                }
            }
        );

        // The project server must provide a "successful response" (status code 200-299)
        // for the task to be completed. Otherwise mark it as failed for recalculation.
        if (projectResponse.ok) {
            // remove if completed successfully
            db.removeTask(projectid, jobid, taskid);
        } else {
            db.setTaskIsFailed(projectid, jobid, taskid, true);
            db.incrementFailedTaskAmount(projectid, jobid, 1);
        }
    } catch (error) {
        // The `fetch` API may throw "TypeError: Failed to fetch"
        // in this case we should also mark the task as failed.
        db.setTaskIsFailed(projectid, jobid, taskid, true);
        db.incrementFailedTaskAmount(projectid, jobid, 1);
    }

    res.sendStatus(200);
};

/**
 * Marks a task as failed in case of client termination.
 */
export const terminateTask: RequestHandler<ParamTypes.Task> = (req, res) => {
    const { projectid, jobid, taskid } = req.params;
    const job = db.getJob(projectid, jobid);
    const task = db.getTask(projectid, jobid, taskid);

    // `job` or `task`` could be null if the client-provided IDs do not exist in the database.
    if (!job || !task) {
        res.sendStatus(422);
        return;
    }

    db.setTaskIsFailed(projectid, jobid, taskid, true);
    db.incrementFailedTaskAmount(projectid, jobid, 1);

    res.sendStatus(200);
};
