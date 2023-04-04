import { ProjectModel } from "./project.model";
import { testData, testJob, testProject } from "./project.test.data";
import { Job, Project } from "../types/global.types";
import JsonDB from "../services/json.db";
import "jest-extended";

describe("ProjectModel", () => {
    let testDB: ProjectModelMock;

    test("can initialize the test model", () => {
        testDB = new ProjectModelMock("test.json");
        testDB.save = jest.fn();
        testDB.refresh();

        expect(testDB.data).toEqual(testData);
    });

    //If this fuckes up getProject and romeveProject will also fail due to bad implementation
    describe("addProject", () => {
        beforeEach(() => {
            testDB.save = jest.fn().mockImplementation(() => {});
        });
        it("can add projects", () => {
            const projectCount = testDB.projects.length;
            testDB.addProject(testProject);

            expect(testDB.projects).toContainEqual(testProject);
            expect(testDB.projects.length).toEqual(projectCount + 1);
        });
        it("runs save after change", () => {
            const dataChange = jest
                .spyOn(testDB.data, "push")
                .mockImplementation(() => 0) as jest.MockInstance<
                unknown,
                unknown[],
                any
            >;

            testDB.addProject(testProject);
            expect(dataChange).toHaveBeenCalled();
            expect(testDB.save).toHaveBeenCalledAfter(dataChange);
        });
    });

    describe("getProject", () => {
        it("can get project", () => {
            const project = testDB.getProject(testProject.projectId);
            expect(project).toEqual(testProject);
        });
    });

    describe("getRandomProject", () => {
        it("can find random projects", () => {
            const randomProject = testDB.getRandomProject();
            expect(randomProject).toBeTruthy();
            expect(testDB.data).toContainEqual(randomProject);
        });
    });

    describe("removeProject", () => {
        it("can remove projects", () => {
            const length = testDB.projects.length;
            testDB.removeProject(testProject.projectId);
            expect(testDB.data).not.toContainEqual(testProject);
            expect(testDB.data.length).toEqual(length - 1);
        });
    });

    describe("getRandomJob", () => {
        it("can find random jobs", () => {
            //for specific project
            const projectId = testData[0].projectId;
            let job = testDB.getRandomJob(projectId);
            let project = testDB.getProject(projectId);
            expect(project?.jobs).toContainEqual(job);

            //for all projects
            job = testDB.getRandomJob() as Job;
            expect(job).toBeTruthy();

            project = testDB.getProject(job.projectId);
            expect(project?.jobs).toContainEqual(job);
        });
    });

    describe("addJob", () => {
        it("can add jobs", () => {
            const projectId = testData[0].projectId;
            const jobAmount = testDB.data[0].jobs.length;
            testDB.addJob(projectId, testJob);
            expect(testDB.data[0].jobs).toContainEqual(testJob);
            expect(testDB.data[0].jobs.length).toEqual(jobAmount + 1);
        });
    });

    describe("getJob", () => {
        it("can find jobs", () => {
            const projectId = testData[0].projectId;
            const jobId = testData[0].jobs[0].jobId;
            const job = testDB.getJob(projectId, jobId);

            expect(testDB.data[0].jobs[0]).toEqual(job);
        });
    });

    describe("decrementTaskAmount", () => {
        it("can decrement task amount", () => {
            const projectId = testData[0].projectId;
            const jobId = testData[0].jobs[1].jobId;

            const job = testDB.getJob(projectId, jobId) as Job;
            expect(job).toBeTruthy();

            const prevTaskAmount = job.taskAmount;

            testDB.decrementTaskAmount(projectId, jobId);
            expect(job.taskAmount).toEqual(prevTaskAmount - 1);
        });
    });

    describe("setTaskAmount", () => {
        let job: Job, project: Project;

        beforeAll(() => {
            project = testData[0];
            const jobId = project.jobs[1].jobId;

            job = testDB.getJob(project.projectId, jobId) as Job;
        });

        it("can set task amount", () => {
            expect(job).toBeTruthy();

            const newTaskAmount = 500;

            testDB.setTaskAmount(job.projectId, job.jobId, newTaskAmount);
            expect(job.taskAmount).toEqual(newTaskAmount);
        });
    });

    describe("removeJob", () => {
        it("can remove jobs", () => {
            const projectId = testData[0].projectId;
            const jobId = testData[0].jobs[0].jobId;
            const job = testDB.getJob(projectId, jobId);
            const jobAmount = testDB.data[0].jobs.length;
            testDB.removeJob(projectId, jobId);

            expect(testDB.data[0].jobs).not.toContainEqual(job);
            expect(testDB.data[0].jobs.length).toEqual(jobAmount - 1);
        });
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