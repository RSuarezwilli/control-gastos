const express = require("express");
const auth = require("../middleware/auth");
const Category = require("../models/Category");

const router = express.Router();
// Crear un nueva categoria
router.post("/new", auth, async (req, res) => {
  try {
    const name = req.body.name;
    const existingCategory = await 
      Category.findOne({ 
      name: name.trim(), 
      User: req.user.id, });

    if (existingCategory) {
      return res.status(400).json({ error: "Ya existe una categoria con este nombre" });
    }
    const category = new Category({ name, User: req.user.id });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});
// obtener todas las categorias

router.get("/list", auth, async (req, res) => {
  try {
    const categories = await Category.find({ User: req.user.id });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener las categorias" });

  }
});

// Actualizar una categoria
router.put("/:id", auth, async (req, res) => {
  const { name } = req.body; // Es mejor desestructurar así
  
  try {
    // 1. Validar que no exista otra categoría con el mismo nombre
    const existingCategory = await Category.findOne({
      name: name.trim(),
      User: req.user.id,
      _id: { $ne: req.params.id },
    });

    if (existingCategory) {
      return res.status(400).json({ 
        error: "Ya existe una categoria con este nombre" 
      });
    }

    // 2. Intentar actualizar
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, User: req.user.id },
      { name },
      { new: true, runValidators: true }
    );

    // 3. Verificar si existía
    if (!category) {
      return res.status(404).json({ error: "Categoria no encontrada" });
    }

    // 4. ¡RESPUESTA FUERA DEL IF! Esto enviará los datos a Postman
    res.json(category);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar la categoria" }); 
  }
});



module.exports = router;