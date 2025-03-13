import express from 'express';
import expenseController from '../controllers/expenseController.js';
import { authMiddleware, roleMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

const { getAllExpenses, getExpenseById, createExpense, updateExpense, deleteExpense } = expenseController

router.get('/', authMiddleware, roleMiddleware(['Admin']), getAllExpenses);
router.get('/:id', authMiddleware, roleMiddleware(['Admin']), getExpenseById);
router.post('/', authMiddleware, roleMiddleware(['Admin']), createExpense);
router.put('/:id', authMiddleware, roleMiddleware(['Admin']), updateExpense);
router.delete('/:id', authMiddleware, roleMiddleware(['Admin']), deleteExpense);

export default router;
