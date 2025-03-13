// jobExecutor.js
export class JobExecutor {
    constructor(job, jobName) {
        this.job = job;
        this.jobName = jobName;
    }

    execute() {
        try {
            this.job();
        } catch (error) {
            console.error(`Error executing ${this.jobName}:`, error);
        }
    }
}
