import cron from "node-cron";
import db from "../models/index.js";
import { gmailCreateDraftWithAttachment } from "../services/emailService.js";
import moment from "moment";
import { Op } from "sequelize";

const { Lease, Payment, Tenant } = db;
export const runPaymentReminderJob = async () => {
    console.log("Running daily rent payment reminder job...");

    try {
        // Find leases where payment is overdue
        const today = moment().format("YYYY-MM-DD");
        const overdueLeases = await Lease.findAll({
            include: [{ model: Tenant }],
                endDate: { [Op.gte]: today }, // Lease still active
                endDate: { $gte: today }, // Lease still active
            })

        for (let lease of overdueLeases) {
            const latestPayment = await Payment.findOne({
                where: { leaseId: lease.id },
                order: [["date", "DESC"]],
            });

            const lastPaymentDate = latestPayment ? moment(latestPayment.date) : moment(lease.startDate);
            const dueDate = lastPaymentDate.add(1, "month"); // Assume rent is due monthly

            if (moment().isAfter(dueDate)) {
                // Payment is overdue, send email reminder
                const tenant = lease.Tenant;
                if (tenant) {
                    const emailText = `Dear ${tenant.name},\n\nYour rent payment is overdue. Please make a payment as soon as possible to avoid late fees.\n\nThank you,\nPDL Rentals LLC.`;
                    await gmailCreateDraftWithAttachment(tenant.email, "Rent Payment Overdue", emailText);
                    console.log(`Late payment reminder sent to ${tenant.email}`);
                }
            }
        }
    } catch (error) {
        console.error("Error running payment reminder job:", error);
    }
};

// Schedule job to run every day at 8 AM
const paymentReminderJob = () => cron.schedule("0 8 * * *", runPaymentReminderJob);

export { paymentReminderJob };