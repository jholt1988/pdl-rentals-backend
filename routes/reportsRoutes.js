import express from 'express';
import {
    getSummary,
    expiringLeases,
    exportLeases,
} from '../controllers/reportsController.js';

const router = express.Router();
router.get('/summary', getSummary);
router.get('/leases/expiring', expiringLeases);
router.get('/leases/export', exportLeases);

export default router;
