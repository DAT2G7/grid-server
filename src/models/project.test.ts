import { ProjectModel } from "./project.model";
import { testAddJob, testData, testProject } from "./project.test.data";
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
        it("can add projects", () => {
            const dataChange = jest
                .spyOn(testDB.data, "push")
                .mockImplementation((...newdata: Project[]) => {
                    testDB.data = [...testDB.data, ...newdata];
                    return 0;
                }) as jest.MockInstance<unknown, unknown[], any>;

            const projectCount = testDB.projects.length;
            testDB.addProject(testProject);
            expect(dataChange).toHaveBeenCalled();
            expect(testDB.save).toHaveBeenCalledAfter(dataChange);
            expect(testDB.projects).toContainEqual(testProject);
            expect(testDB.projects.length).toEqual(projectCount + 1);
        });
    });

    describe("getProject", () => {
        it("can get project", () => {
            const project = testDB.getProject(testProject.projectid);
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
            testDB.removeProject(testProject.projectid);
            expect(testDB.data).not.toContainEqual(testProject);
            expect(testDB.data.length).toEqual(length - 1);
        });
    });

    describe("getRandomJob", () => {
        it("can find random jobs", () => {
            //for specific project
            const projectid = testData[0].projectid;
            let job = testDB.getRandomJob(projectid);
            let project = testDB.getProject(projectid);
            expect(project?.jobs).toContainEqual(job);

            //for all projects
            job = testDB.getRandomJob() as Job;
            expect(job).toBeTruthy();

            project = testDB.getProject(job.projectid);
            expect(project?.jobs).toContainEqual(job);
        });
    });

    describe("addJob", () => {
        it("can add jobs", () => {
            const projectid = testData[0].projectid;
            const jobAmount = testDB.data[0].jobs.length;
            testDB.addJob(projectid, testAddJob);

            expect(testDB.data[0].jobs).toPartiallyContain(testAddJob);
            expect(testDB.data[0].jobs.length).toEqual(jobAmount + 1);
        });
    });

    describe("getJob", () => {
        it("can find jobs", () => {
            const projectid = testData[0].projectid;
            const jobid = testData[0].jobs[0].jobid;
            const job = testDB.getJob(projectid, jobid);

            expect(testDB.data[0].jobs[0]).toEqual(job);
        });
    });

    describe("decrementTaskAmount", () => {
        it("can decrement task amount", () => {
            const projectid = testData[0].projectid;
            const jobid = testData[0].jobs[1].jobid;

            const job = testDB.getJob(projectid, jobid) as Job;
            expect(job).toBeTruthy();

            const prevTaskAmount = job.taskAmount;

            testDB.decrementTaskAmount(projectid, jobid);
            expect(job.taskAmount).toEqual(prevTaskAmount - 1);
        });
    });

    describe("setTaskAmount", () => {
        let job: Job, project: Project;

        beforeAll(() => {
            project = testData[0];
            const jobid = project.jobs[1].jobid;

            job = testDB.getJob(project.projectid, jobid) as Job;
        });

        it("can set task amount", () => {
            expect(job).toBeTruthy();

            const newTaskAmount = 500;

            testDB.setTaskAmount(job.projectid, job.jobid, newTaskAmount);
            expect(job.taskAmount).toEqual(newTaskAmount);
        });
    });

    describe("removeJob", () => {
        it("can remove jobs", () => {
            const projectid = testData[0].projectid;
            const jobid = testData[0].jobs[0].jobid;
            const job = testDB.getJob(projectid, jobid);
            const jobAmount = testDB.data[0].jobs.length;
            testDB.removeJob(projectid, jobid);

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
