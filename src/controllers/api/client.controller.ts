import { ClientTask } from "../../types/body.types";
import { ParamTypes } from "../../types";
import { RequestHandler } from "express";
import { TaskUUID } from "../../types/brand.types";
import config from "../../config";
import db from "../../models/project.model";
import { getId } from "../../utils/random";
import path from "path";

/**
 * Assigns a task from a random job and sends the information to the client.
 * @param {ClientTask} res.body - Contains the raw task data received from the project server.
 */
export const getSetup: RequestHandler<Record<string, never>, ClientTask> = (
    _req,
    res
) => {
    const job = db.getRandomJob();

    if (!job) {
        res.sendStatus(400);
        return;
    }

    const responseData: ClientTask = {
        projectId: job.projectid,
        jobId: job.jobid,
        coreId: job.coreid,
        taskId: getId() as TaskUUID
    };

    db.decrementTaskAmount(job.projectid, job.jobid);

    res.status(200).send(responseData);
};

/**
 * Sends the core file to the client.
 * @param req.params.coreid - The ID of the core.
 */
export const getCore: RequestHandler<ParamTypes.Core, Buffer> = (req, res) => {
    const { coreid } = req.params;
    res.sendFile(path.resolve(config.CORE_ROOT, coreid + ".js"));
};

/**
 * Fetches task data from a project server and sends it to the client.
 * @param req.params.taskId - The task ID.
 * @param req.params.projectid - The associated project ID.
 * @param req.params.jobid - The associated job ID.
 * @param res.body - Contains the raw task data received from the project server.
 */
export const getTask: RequestHandler<ParamTypes.Task> = async (req, res) => {
    const { projectid, jobid, taskid } = req.params;
    const job = db.getJob(projectid, jobid);

    if (!job) {
        res.sendStatus(400);
        return;
    }

    // TODO: Better error handling
    let taskData: unknown;
    try {
        taskData = await (
            await fetch(
                `${job.taskRequestEndpoint}?taskid=${taskid}&jobid=${jobid}&projectid=${projectid}`
            )
        ).json();
    } catch (error) {
        res.sendStatus(500);
        return;
    }

    res.status(200).send(taskData);
};

/**
 * Receives result data from the client and sends it to the project server.
 * @param req.body - The result data to be relayed.
 * @param req.params.taskId - The task ID.
 * @param req.params.projectid - The associated project ID.
 * @param req.params.jobid - The associated job ID.
 */
export const postResult: RequestHandler<ParamTypes.Task> = async (req, res) => {
    const { projectid, jobid, taskid } = req.params;
    const job = db.getJob(projectid, jobid);

    if (!job) {
        res.sendStatus(400);
        return;
    }

    fetch(
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
    res.sendStatus(200);
};
