const lateFeeJob = require("../jobs/lateFeeJob");
const leaseExpiryJob = require('../jobs/leaseExpiryJob')
const paymentReminderJob = require('../jobs/paymentReminderJob')
const rentChargeJob = require('../jobs/rentChargeJob')

module.exports = () => {
    lateFeeJob()
    leaseExpiryJob()
    paymentReminderJob()
    rentChargeJob()
}