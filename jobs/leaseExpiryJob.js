import cron from "node-cron";
import db from "../models/index.js";
import { sendReceipt } from "../services/emailService.js";
import moment from "moment";

const { Lease, Tenant } = db;
export const runLeaseExpiryJob = async () => {
  console.log("Running lease expiration reminder job...");

  try {
    const today = moment();
    const upcomingLeases = await Lease.findAll({
      include: [{ model: Tenant }],
      where: {
        endDate: {
          $lte: today.add(30, "days").format("YYYY-MM-DD"), // Leases expiring in the next 30 days
        },
      },
    });

    for (let lease of upcomingLeases) {
      const tenant = lease.Tenant;
      if (tenant) {
        const emailText = `Dear ${tenant.name},\n\nYour lease is set to expire on ${lease.endDate}. Please contact the landlord for renewal options.\n\nThank you,\nPDL Rentals LLC.`;
        await sendReceipt(tenant.email, "Lease Expiration Notice", emailText);
        console.log(`Lease expiry reminder sent to ${tenant.email}`);
      }
    }
  } catch (error) {
    console.error("Error running lease expiration job:", error);
  }
};

// Run every day at 9 AM
const leaseExpiryJob = () => cron.schedule("0 9 * * *", runLeaseExpiryJob);

export {leaseExpiryJob}