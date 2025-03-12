import db from "../models/index.js";

const { Payment, Lease, MaintenanceRequest } = db;
export const getAdminStats = async (req, res) => {
    try {
        const totalRevenue = await Payment.sum("amount");
        const totalPaid = await Payment.count();
        const overduePayments = await Lease.count({
            where: {
                endDate: { $lte: new Date() }, // Leases past their payment date
            },
        });

        const upcomingLeases = await Lease.findAll({
            where: { endDate: { $lte: new Date(new Date().setMonth(new Date().getMonth() + 1)) } },
        });

        const maintenanceRequests = await MaintenanceRequest.findAll();

        res.status(200).json({
            totalRevenue,
            totalPaid,
            overduePayments,
            upcomingLeases: upcomingLeases.length,
            maintenanceRequests: maintenanceRequests.length,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching admin stats", error });
    }
};