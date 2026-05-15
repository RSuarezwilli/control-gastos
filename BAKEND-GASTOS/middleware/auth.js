const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // req.get('header') es la forma recomendada por Express
    const authHeader = req.get('authorization'); 

    if (!authHeader) {
        return res.status(401).json({ error: "No se proporcionó la cabecera de autorización" });
    }

    if (!authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Formato de token mal formado (debe ser Bearer)" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (error) {
        console.error("Error al verificar JWT:", error.message);
        res.status(401).json({ error: "Token inválido o expirado" });
    }
};

module.exports = auth;
