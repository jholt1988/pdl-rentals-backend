import db from '../models/index.js';
import { Op } from 'sequelize';
import { Parser } from 'json2csv';
const { Lease, User, MaintenanceRequest, Payment } = db;

export const getSummary = async (req, res) => {
    try {
        const [leaseCount, activeLeases, totalUsers, openRequests, totalPayments] = await Promise.all([
            Lease.count(),
            Lease.count({ where: { status: 'active' } }),
            User.count(),
            MaintenanceRequest.count({ where: { status: 'open' } }),
            Payment.sum('amount'),
        ]);

        res.json({
            leases: { total: leaseCount, active: activeLeases },
            users: totalUsers,
            maintenance: { open: openRequests },
            revenue: totalPayments,
        });
    } catch (error) {
        console.error('Report generation failed:', error);
        res.status(500).json({ error: 'Could not generate report' });
    }
};

export const expiringLeases = async (req, res) => {
    try {
        const in30Days = new Date();
        in30Days.setDate(in30Days.getDate() + 30);

        const leases = await Lease.findAll({
            where: {
                endDate: {
                    [Op.lte]: in30Days,
                },
            },
        });

        res.json({ leases });
    } catch (error) {
        console.error('Failed to fetch expiring leases:', error);
        res.status(500).json({ error: 'Could not fetch expiring leases' });
    }
};

export const exportLeases = async (req, res) => {
    try {
        const leases = await Lease.findAll({ raw: true });

        const parser = new Parser();
        const csv = parser.parse(leases);

        res.header('Content-Type', 'text/csv');
        res.attachment('leases.csv');
        res.send(csv);
    } catch (error) {
        console.error('CSV export failed:', error);
        res.status(500).json({ error: 'Could not export leases' });
    }
};
