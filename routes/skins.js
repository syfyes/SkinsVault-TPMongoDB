const express = require('express');
const router = express.Router();
const Skin = require('../models/Skin');

// GET /api/skins — Liste tous les skins du catalogue
router.get('/', async (req, res, next) => {
  try {
    const skins = await Skin.find().sort({ rarete: 1, prix: 1 });
    res.json(skins);
  } catch (err) {
    next(err);
  }
});

// GET /api/skins/:id — Détail d'un skin
router.get('/:id', async (req, res, next) => {
  try {
    const skin = await Skin.findById(req.params.id);
    if (!skin) return res.status(404).json({ message: 'Skin introuvable' });
    res.json(skin);
  } catch (err) {
    next(err);
  }
});

// POST /api/skins — Créer un nouveau skin
router.post('/', async (req, res, next) => {
  try {
    const skin = new Skin(req.body);
    await skin.save();
    res.status(201).json(skin);
  } catch (err) {
    next(err);
  }
});

// PUT /api/skins/:id — Mettre à jour un skin
router.put('/:id', async (req, res, next) => {
  try {
    const skin = await Skin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!skin) return res.status(404).json({ message: 'Skin introuvable' });
    res.json(skin);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/skins/:id — Supprimer un skin
router.delete('/:id', async (req, res, next) => {
  try {
    const skin = await Skin.findByIdAndDelete(req.params.id);
    if (!skin) return res.status(404).json({ message: 'Skin introuvable' });
    res.json({ message: 'Skin supprimé avec succès' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
