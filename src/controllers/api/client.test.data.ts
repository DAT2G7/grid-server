import { Project } from "../../types/global.types";
import { UUID } from "../../types/brand.types";

export const setupMockData: Project[] = [
    {
        projectId: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e" as UUID,
        jobs: [
            {
                projectId: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e" as UUID,
                jobId: "1eb9971f-e713-45b9-8584-8e2bc72a386b" as UUID,
                coreId: "c945fe39-e77e-4b51-a7f4-229bba2ae648" as UUID,
                taskAmount: 200,
                taskRequestEndpoint:
                    "http://url/to/project/owner/taskRequstEndpoint",
                taskResultEndpoint:
                    "http://url/to/project/owner/taskResultEndpoint"
            }
        ]
    }
];