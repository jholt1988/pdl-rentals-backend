import cron from "node-cron";
import db from "../models/index.js";
import { Op } from "sequelize";

const { Lease, LedgerEntry } = db;
export const runRentChargeJob = async () => {
    try {
        console.log("Running rent charge job...");
        // Find all active leases (leases that started and haven't ended)
        const today = new Date();
        const activeLeases = await Lease.findAll({
            where: {
                startDate: { [Op.lte]: today },
                endDate: { [Op.gte]: today },
            },
        });

        for (const lease of activeLeases) {
            // Create a ledger entry for the monthly rent charge
            await LedgerEntry.create({
                tenantId: lease.tenantId,
                leaseId: lease.id,
                type: "charge",
                amount: lease.rentAmount,
                description: "Monthly rent charge",
                date: today,
            });
        }
        console.log("Rent charges applied for all active leases.");
    } catch (error) {
        console.error("Error applying rent charges:", error);
    }
};

// Schedule: Run at midnight on the 1st of every month.
const rentChargeJob = () => cron.schedule("0 0 1 * *", runRentChargeJob);

export { rentChargeJob };