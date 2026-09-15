const mongoose = require('mongoose');
const User = require('./User');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre de la categoria es obligatorio"],
        unique: [true, "La categoría ya existe"],
    },
    User: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});
module.exports = mongoose.model('Category', categorySchema);