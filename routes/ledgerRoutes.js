import express from 'express';
import * as ledgerController from '../controllers/ledgerController.js';

const router = express.Router();

router.get('/:tenantId', ledgerController.getLedgerForTenant);
router.get('/:tenantId/balance', ledgerController.getBalanceForTenant);
router.post('/charge', ledgerController.addCharge);
router.post('/payment', ledgerController.addPayment);
// router.get('/charges', ledgerController.getAllCharges);
// router.get('/payments', ledgerController.getAllPayments);
// router.get('/transactions', ledgerController.getAllTransactions);
router.get('/preview-statement/:tenantId', ledgerController.createTenantPaymentStatement);
router.post('/send-statement/:tenantId', ledgerController.sendTenantStatement);
router.get('/send-receipt/:paymentId', ledgerController.sendPaymentReceipt);

export default router;