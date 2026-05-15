const mogoose = require('mongoose');
const User = require('./User');

const categorySchema = new mogoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre de la categoria es obligatorio"],
        unique: [true, "La categoría ya existe"],
    },
    User: {
        type: mogoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
});
module.exports = mogoose.model('Category', categorySchema);