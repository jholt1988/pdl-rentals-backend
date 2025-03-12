// jobs/lateFeeJob.js
import { schedule } from "node-cron";
import db from "../models/index.js";
import { Op } from "sequelize";

// Define due day (e.g., payments are due by the 5th of each month)
const { Lease, Payment, LedgerEntry } = db;
const DUE_DAY = 3;
const LATE_FEE_PERCENT = 0.05; // 5% late fee

// Schedule: Run every day at 1 AM.
schedule("0 1 * * *", async () => {
    try {
        console.log("Running late fee job...");
        const today = new Date();
        const dayOfMonth = today.getDate();

        // Only apply late fees if today's day is past the due day.
        if (dayOfMonth <= DUE_DAY) return;

        // Get all active leases.
        const activeLeases = await Lease.findAll({
            where: {
                startDate: { [Op.lte]: today },
                endDate: { [Op.gte]: today },
            },
        });

        for (const lease of activeLeases) {
            // Check if a payment has been received for this month.
            // For simplicity, we'll assume if there's no payment ledger entry for this month, then it's late.
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

            const paymentReceived = await Payment.findOne({
                where: {
                    leaseId: lease.id,
                    date: {
                        [Op.between]: [startOfMonth, endOfMonth],
                    },
                },
            });

            // If no payment is found, check if a late fee has already been applied.
            if (!paymentReceived) {
                const existingLateFee = await LedgerEntry.findOne({
                    where: {
                        leaseId: lease.id,
                        type: "charge",
                        description: "Late fee",
                        date: {
                            [Op.between]: [startOfMonth, endOfMonth],
                        },
                    },
                });

                if (!existingLateFee) {
                    // Calculate the late fee (e.g., 5% of the rent)
                    const lateFee = parseFloat(lease.rentAmount) * LATE_FEE_PERCENT;
                    await LedgerEntry.create({
                        tenantId: lease.tenantId,
                        leaseId: lease.id,
                        type: "charge",
                        amount: lateFee,
                        description: "Late fee",
                        date: today,
                    });
                    console.log(`Late fee applied for lease ${lease.id}`);
                }
            }
        }
        console.log("Late fee job completed.");
    } catch (error) {
        console.error("Error applying late fees:", error);
    }
});
// Explanation:
// This code snippet defines a cron job that runs every day at 1 AM to apply late fees to tenants who have not paid their rent by the due date. 