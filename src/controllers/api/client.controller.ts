import { ClientTask } from "../../types/body.types";
import { ParamTypes } from "../../types";
import { RequestHandler } from "express";
import { JobUUID, ProjectUUID, TaskUUID } from "../../types/brand.types";
import config from "../../config";
import db from "../../models/project.model";
import { getId } from "../../utils/random";
import path from "path";
import { Job, Project } from "../../types/global.types";

/**
 * Serve core-, job- and task-id
 */
export const getSetup: RequestHandler<Record<string, never>, ClientTask> = (
    _req,
    res
) => {
    const job = db.getRandomJob();

    if (!job) {
        res.sendStatus(422);
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

    if (!job) {
        res.sendStatus(422);
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
 * Post result to project owner
 */
export const postResult: RequestHandler<ParamTypes.Task> = async (req, res) => {
    const { projectid, jobid, taskid } = req.params;
    const job = db.getJob(projectid, jobid);

    if (!job) {
        res.sendStatus(422);
        return;
    }

    const response = await fetch(
        `${job.taskResultEndpoint}?taskid=${taskid}&jobid=${jobid}&projectid=${projectid}`,
        {
            method: "POST",
            body: JSON.stringify(req.body),
            headers: {
                "Content-Type":
                    req.headers["content-type"] || "application/json"
            }
        }
    ).then((res) => res.json());

    res.sendStatus(200);

    if (response.status !== 200) {
        let latestAttempt = false;
        const timeoutId = setTimeout(() => clearInterval(intervalId), 15000000); //4 hours
        const intervalId = setInterval(async function () {
            const response = await fetch(
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
            if (response.status === 200) latestAttempt = true;
        }, 600000); //10 minutes
        if (latestAttempt) {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        }
    }
};
