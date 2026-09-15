const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const validator = require("validator");


const router = express.Router();

//Ruta registro

router.post("/register", async (req, res) => {

  try {
    const { name, email, password } = req.body;
    if (!validator.isEmail(email)) {
    return res.status(400).json({ error: "Correo inválido" });

    }
    if (!validator.isLength(password, { min: 6 })) {
    return res.status(400).json({ error: "La contraseña debe tener minimo 6 caracteres" });

    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({name, email, password: hashedPassword});
    await user.save();
    res.status(201).json({message: "Usuario registrado con éxito"});
    } catch (error) {
    res.status(400).json({error: error.message})
    }
});
//Ruta de login(logiar un usuario)
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        // validar correo
        const user = await User.findOne({ email });
        if (!user) {return res.status(404).json({ error: "Usuario no encontrado" });}

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {return res.status(401).json({ error: "Contraseña incorrecta" });}

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: "1d"});
        res.status(200).json({token});

    } catch (error) {
        console.error(error);
        res.status(400).json({error: error.message})
    }
})


module.exports = router;