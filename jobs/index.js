// jobs/index.js
import { lateFeeJob } from '../jobs/lateFeeJob.js';
import { leaseExpiryJob } from '../jobs/leaseExpiryJob.js';
import { paymentReminderJob } from '../jobs/paymentReminderJob.js';
import { rentChargeJob } from '../jobs/rentChargeJob.js';
import { JobExecutor } from './jobExecutor.js';
import { Logger } from '../util/jobsLogger.js';

const jobs = [
    { job: lateFeeJob, name: 'lateFeeJob' },
    { job: leaseExpiryJob, name: 'leaseExpiryJob' },
    { job: paymentReminderJob, name: 'paymentReminderJob' },
    { job: rentChargeJob, name: 'rentChargeJob' }
];

export default () => {
    jobs.forEach(({ job, name }) => {
        const executor = new JobExecutor(job, name);
        executor.execute();
    });
};
