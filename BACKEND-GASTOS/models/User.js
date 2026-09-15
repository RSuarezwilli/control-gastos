const mogoose = require('mongoose');
const { isLowercase } = require('validator');

const userSchema = new mogoose.Schema({
    name: {
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    email:{
        type: String,
        required: [true, "El email es obligatorio"],
        unique: [true, "El email ya existe"],
        Lowercase: true,
    },
    password:{
        type: String,
        required: [true, "La contraseña es obligatoria"],
    },
});
module.exports = mogoose.model('User', userSchema);