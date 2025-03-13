// logger.js
export class Logger {
    static logError(jobName, error) {
        console.error(`Error executing ${jobName}:`, error);
    }
}
