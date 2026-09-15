const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'El titulo es obligatorio'],
  },
  amount: {
    type: Number,
    required: [true, 'El monto es obligatorio'],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoria es obligatoria'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true

  }});

module.exports = mongoose.model('Expense', expenseSchema);