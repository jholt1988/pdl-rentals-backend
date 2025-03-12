import db from '../models/index.js';

const { Expense } = db;
export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving expenses', error });
    }
};

// Implement other Expense CRUD functions
export const getExpenseById = async (req, res) => {
    try {
        const expense = await Expense.findByPk(req.params.id);
        if (!expense) return res.status(404).json({ message: 'Expense not found' });
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving expense', error });
    }
};
