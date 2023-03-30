import { UUID } from "../types/brand.types";
import { Job, Project } from "../types/global.types";
import { ProjectModel } from "./project.model";
import JsonDB from "../services/json.db";

describe("ProjectModel", () => {
    let testDB: ProjectModelMock;

    test("can initialize the test model", () => {
        testDB = new ProjectModelMock("test.json");
        testDB.refresh();

        expect(testDB.data).toEqual(testData);
    });

    it("can add projects (addProject)", () => {
        const projectCount = testDB.projects.length;
        testDB.addProject(testProject);

        expect(testDB.projects).toContainEqual(testProject);
        expect(testDB.projects.length).toEqual(projectCount + 1);
    });

    it("can find projects (getProject)", () => {
        const project = testDB.getProject(testProject.projectId);
        expect(project).toEqual(testProject);
    });

    it("can find random projects (getRandomProject)", () => {
        const randomProject = testDB.getRandomProject();
        expect(randomProject).toBeTruthy();
        expect(testDB.data).toContainEqual(randomProject);
    });

    it("can remove projects (removeProject)", () => {
        const length = testDB.projects.length;
        testDB.removeProject(testProject.projectId);
        expect(testDB.data).not.toContainEqual(testProject);
        expect(testDB.data.length).toEqual(length - 1);
    });

    it("can find random jobs (getRandomJob)", () => {
        //for specific project
        const projectId = testData[0].projectId;
        let job = testDB.getRandomJob(projectId);
        let project = testDB.getProject(projectId);
        expect(project?.jobs).toContainEqual(job);

        //for all projects
        job = testDB.getRandomJob();
        expect(job).toBeTruthy();

        project = testDB.getProject(job!.projectId);
        expect(project?.jobs).toContainEqual(job);
    });

    it("can add jobs (addJob)", () => {
        const projectId = testData[0].projectId;
        const jobAmount = testDB.data[0].jobs.length;
        testDB.addJob(projectId, testJob);
        expect(testDB.data[0].jobs).toContainEqual(testJob);
        expect(testDB.data[0].jobs.length).toEqual(jobAmount + 1);
    });

    it("can find jobs (getJob)", () => {
        const projectId = testData[0].projectId;
        const jobId = testData[0].jobs[0].jobId;
        const job = testDB.getJob(projectId, jobId);

        expect(testDB.data[0].jobs[0]).toEqual(job);
    });

    it("can increment task amount (incrementTaskAmount)", () => {
        const projectId = testData[0].projectId;
        const jobId = testData[0].jobs[1].jobId;
        const job = testDB.getJob(projectId, jobId);
        //Test for correct increment
        const currentTaskAmount = testDB.data[0].jobs[1].taskAmount;
        testDB.incrementTaskAmount(projectId, jobId, -1);
        expect(testDB.data[0].jobs[1].taskAmount).toEqual(
            currentTaskAmount - 1
        );

        //test for correct deletion
        const jobAmount = testDB.data[0].jobs.length;
        testDB.incrementTaskAmount(projectId, jobId, -1);
        expect(testDB.data[0].jobs).not.toContainEqual(job);
        expect(testDB.data[0].jobs.length).toEqual(jobAmount - 1);
    });

    it("can remove jobs (removeJob)", () => {
        const projectId = testData[0].projectId;
        const jobId = testData[0].jobs[0].jobId;
        const job = testDB.getJob(projectId, jobId);
        const jobAmount = testDB.data[0].jobs.length;
        testDB.removeJob(projectId, jobId);

        expect(testDB.data[0].jobs).not.toContainEqual(job);
        expect(testDB.data[0].jobs.length).toEqual(jobAmount - 1);
    });
});

class ProjectModelMock extends ProjectModel {
    refresh(): JsonDB<Project[]> {
        this.data = testData;
        return this;
    }

    save(): JsonDB<Project[]> {
        return this;
    }
}

const testData: Project[] = [
    {
        projectId: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e" as UUID,
        jobs: [
            {
                jobId: "5eb9971f-e713-45b9-8584-8e2bc72a386b" as UUID,
                coreId: "c945fe39-e77e-4b51-a7f4-229bba2ae648" as UUID,
                projectId: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e" as UUID,
                taskAmount: 200,
                taskRequestEndpoint:
                    "http://url/to/project/owner/taskRequstEndpoint",
                taskResultEndpoint:
                    "http://url/to/project/owner/taskResultEndpoint"
            },
            {
                jobId: "495886eb-f6ee-4a65-bf0d-4f6f3aa2c599" as UUID,
                coreId: "d7e36d1e-5f87-4b03-89ac-cb5767f4c61b" as UUID,
                projectId: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e" as UUID,
                taskAmount: 2,
                taskRequestEndpoint:
                    "http://url/to/project/owner/taskRequstEndpoint",
                taskResultEndpoint:
                    "http://url/to/project/owner/taskResultEndpoint"
            }
        ]
    }
];

const testProject: Project = {
    projectId: "d68993c6-050e-4ff5-8fb4-d7501386890c" as UUID,
    jobs: []
};

const testJob: Job = {
    jobId: "195886eb-f6ee-4a65-bf0d-4f6f3aa2c599" as UUID,
    coreId: "d7e36d1e-5f87-4b03-89ac-cb5767f4c61b" as UUID,
    projectId: "ba5868ea-8e4d-4f50-87ee-c6bd01ad635e" as UUID,
    taskAmount: 100,
    taskRequestEndpoint: "http://url/to/project/owner/taskRequstEndpoint",
    taskResultEndpoint: "http://url/to/project/owner/taskResultEndpoint"
};
