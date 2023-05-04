import { Project } from "../../types/global.types";
import { UUID } from "../../types/brand.types";

export const setupMockData: Project[] = [
    {
        projectid: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e" as UUID,
        jobs: [
            {
                projectid: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e" as UUID,
                jobid: "1eb9971f-e713-45b9-8584-8e2bc72a386b" as UUID,
                coreid: "c945fe39-e77e-4b51-a7f4-229bba2ae648" as UUID,
                taskAmount: 200,
                failedTaskAmount: 0,
                tasks: [],
                taskRequestEndpoint:
                    "http://url/to/project/owner/taskRequstEndpoint",
                taskResultEndpoint:
                    "http://url/to/project/owner/taskResultEndpoint"
            }
        ]
    }
];
