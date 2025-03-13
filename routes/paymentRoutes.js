import express from 'express';
import paymentController from '../controllers/paymentController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

const {
  getAllPayments,
  getPaymentById,
  createPayment,
  updatePayment,
  deletePayment,
  sendPaymentReceipt,
  sendTenantPaymentStatement,
  getTenantBalances,
  viewTenantStatement
} = paymentController;

router.get('/', authMiddleware, roleMiddleware(['Admin']), getAllPayments);
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), getPaymentById);
router.post('/', authMiddleware, roleMiddleware(['Admin']), createPayment);
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), updatePayment);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deletePayment);
router.post('/send-receipt', authMiddleware, roleMiddleware(['Admin']), sendPaymentReceipt);
router.post('/send-statement/:tenantId', authMiddleware, roleMiddleware(['Admin']), sendTenantPaymentStatement);
router.get('/balances', authMiddleware, roleMiddleware(['Admin']), getTenantBalances);
router.get('/preview-statement/:tenantId', authMiddleware, roleMiddleware(['Admin']), viewTenantStatement);

export default router;
