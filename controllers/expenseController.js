import db from '../models/index.js';
import * as res from 'express/lib/response';

const { Expense } = db;

const expenseController = {
    createExpense: async (req, res) => {
        try {
            const expense = await Expense.create(req.body);
            res.status(201).json(expense);
        } catch (error) {
            res.status(500).json({ message: 'Error creating expense', error });
        }
    },
    // Implement other Expense CRUD functions

  getAllExpenses: async (req, res) => {
    try {
        const expenses = await Expense.findAll();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving expenses', error });
    }
    },
    getExpenseById: async (req, res) => {
        try {
            const expense = await Expense.findByPk(req.params.id);
            if (!expense) return res.status(404).json({ message: 'Expense not found' });
            res.status(200).json(expense);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving expense', error });
        }
    }, 
    UpdateExpense: async (req, res) => {
        try {
            const expense = await Expense.findByPk(req.params.id);
            if (!expense) return res.status(404).json({ message: 'Expense not found' });
            await expense.update(req.body);
            res.status(200).json(expense);
        } catch (error) {
            res.status(500).json({ message: 'Error updating expense', error });
        }
    },
    deleteExpense: async (req, res) => {
        try {
            const expense = await Expense.findByPk(req.params.id);
            if (!expense) return res.status(404).json({ message: 'Expense not found' });
            await expense.destroy();
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting expense', error });
        }
    },
    getExpensesByUserId: async (req, res) => {
        try {
            const expenses = await Expense.findAll({ where: { userId: req.params.userId } });
            res.status(200).json(expenses);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving expenses', error });
        }
    }, 
    UpdateExpense: async (req, res) => {
        try{
            const expense = await Expense.findByPk(req.params.id);
            if (!expense) return res.status(404).json({ message: 'Expense not found' });
            await expense.update(req.body);
            res.status(200).json(expense);
        }catch(error){
            res.status(500).json({ message: 'Error updating expense', error });
        }
    }
        
};


export default expenseController;