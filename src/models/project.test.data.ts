import { UUID } from "../types/brand.types";
import { Job, Project } from "../types/global.types";
import { AddJobPayload } from "./project.model";

export const testData: Project[] = [
    {
        projectid: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e" as UUID,
        jobs: [
            {
                jobid: "5eb9971f-e713-45b9-8584-8e2bc72a386b" as UUID,
                coreid: "c945fe39-e77e-4b51-a7f4-229bba2ae648" as UUID,
                projectid: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e" as UUID,
                taskAmount: 200,
                taskRequestEndpoint:
                    "http://url/to/project/owner/taskRequstEndpoint",
                taskResultEndpoint:
                    "http://url/to/project/owner/taskResultEndpoint"
            },
            {
                jobid: "495886eb-f6ee-4a65-bf0d-4f6f3aa2c599" as UUID,
                coreid: "d7e36d1e-5f87-4b03-89ac-cb5767f4c61b" as UUID,
                projectid: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e" as UUID,
                taskAmount: 2,
                taskRequestEndpoint:
                    "http://url/to/project/owner/taskRequstEndpoint",
                taskResultEndpoint:
                    "http://url/to/project/owner/taskResultEndpoint"
            }
        ]
    }
];

export const testProject: Project = {
    projectid: "d68993c6-050e-4ff5-8fb4-d7501386890c" as UUID,
    jobs: []
};

export const testJob: Job = {
    jobid: "195886eb-f6ee-4a65-bf0d-4f6f3aa2c599" as UUID,
    coreid: "d7e36d1e-5f87-4b03-89ac-cb5767f4c61b" as UUID,
    projectid: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e" as UUID,
    taskAmount: 100,
    taskRequestEndpoint: "http://url/to/project/owner/taskRequstEndpoint",
    taskResultEndpoint: "http://url/to/project/owner/taskResultEndpoint"
};

export const testAddJob: AddJobPayload = {
    coreId: "d7e36d1e-5f87-4b03-89ac-cb5767f4c61b" as UUID,
    taskAmount: 100,
    taskRequestEndpoint: "http://url/to/project/owner/taskRequstEndpoint",
    taskResultEndpoint: "http://url/to/project/owner/taskResultEndpoint"
};
