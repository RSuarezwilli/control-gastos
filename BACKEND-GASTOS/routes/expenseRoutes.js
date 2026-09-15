const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

const router = express.Router();

// 1. Crear un nuevo gasto
router.post("/new", auth, async (req, res) => {
    try {
        const { title, amount, date, category } = req.body;
        const expense = new Expense({
            title,
            amount,
            date: date || Date.now(),
            category,
            user: req.user.id // Vinculamos el gasto al usuario logueado
        });
        
        await expense.save();
        
        const responseExpense = {
            ...expense.toObject(),
            date: new Date(expense.date).toLocaleString("es-CO", { timeZone: "America/Bogota" })
        };
        res.status(201).json(responseExpense);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

// 2. Obtener todos los gastos del usuario autenticado
router.get("/all", auth, async (req, res) => {
    try {
        // Solo buscamos los gastos donde el campo user coincida con req.user.id
        const expenses = await Expense.find({ user: req.user.id }).sort({ date: -1 });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los gastos" });
    }
});

// 3. Actualizar un gasto
router.put("/:id", auth, async (req, res) => {
    try {
        const { title, amount, date, category } = req.body;
        
        // Filtramos por ID del gasto y por el ID del usuario para que nadie edite lo ajeno
        const expense = await Expense.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            { title, amount, date, category },
            { new: true, runValidators: true }
        );

        if (!expense) {
            return res.status(404).json({ error: "Gasto no encontrado o no autorizado" });
        }
        
        res.json(expense);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 4. Eliminar un gasto
router.delete("/:id", auth, async (req, res) => {
    try {
        const expense = await Expense.findOneAndDelete({ 
            _id: req.params.id, 
            user: req.user.id 
        });

        if (!expense) {
            return res.status(404).json({ error: "Gasto no encontrado" });
        }

        res.json({ message: "Gasto eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar el gasto" });
    }
});

// 5. Obtener gastos por categoría
router.get("/category/:categoryId", auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ 
            user: req.user.id, 
            category: req.params.categoryId 
        });
        res.json(expenses);
    } catch (error) {
        res.status(500).json({ error: "Error al filtrar por categoría" });
    }
});

module.exports = router;