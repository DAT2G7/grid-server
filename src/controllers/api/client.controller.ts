import { ParamTypes } from "../../types";
import { RequestHandler } from "express";
import fs from "fs";
import { getRandomInt } from "../../utils/random";
import { Project } from "../../types/global.types";

/**
 * Serve core-, job- and task-id
 */
export const getSetup: RequestHandler = (_req, res) => {
    if (!process.env.PROJECT_DB_PATH) {
        //Throw an error
        res.status(500).send();
        return;
    }

    //Find random project
    const projects: Project[] = JSON.parse(
        fs
            .readFileSync(process.cwd() + process.env.PROJECT_DB_PATH) //process.env.PROJECT_ROOT!)
            .toString()
    );
    const project = projects[getRandomInt(0, projects.length)];

    //Find random job
    const job = project.jobs[getRandomInt(0, project.jobs.length)];

    //Retrun projectId & jobId
    res.status(200).send(
        JSON.stringify({
            projectId: project.projectId,
            jobId: job.jobId
        })
    );
};

/**
 * Serve core
 */
export const getCore: RequestHandler<ParamTypes.Core> = (_req, res) => {
    res.sendStatus(200);
};

/**
 * Retrieve and serve task data
 */
export const getTask: RequestHandler<ParamTypes.Task> = (req, res) => {
    const { coreid, jobid, taskid } = req.params;
    console.log("ids:", coreid, jobid, taskid);
    res.sendStatus(200);
};

/**
 * Post result to project owner
 */
export const postResult: RequestHandler<ParamTypes.Task> = (_req, res) => {
    res.sendStatus(200);
};
