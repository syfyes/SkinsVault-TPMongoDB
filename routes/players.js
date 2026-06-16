const express = require('express');
const router = express.Router();
const Player = require('../models/Player');
const Skin = require('../models/Skin');

// GET /api/players — Liste tous les joueurs
router.get('/', async (req, res, next) => {
  try {
    const players = await Player.find().populate('inventory.skinId');
    res.json(players);
  } catch (err) {
    next(err);
  }
});

// GET /api/players/:id — Détail d'un joueur avec inventaire peuplé
router.get('/:id', async (req, res, next) => {
  try {
    const player = await Player.findById(req.params.id).populate('inventory.skinId');
    if (!player) return res.status(404).json({ message: 'Joueur introuvable' });
    res.json(player);
  } catch (err) {
    next(err);
  }
});

// POST /api/players — Enregistrer un nouveau joueur
router.post('/', async (req, res, next) => {
  try {
    const player = new Player(req.body);
    await player.save();
    res.status(201).json(player);
  } catch (err) {
    next(err);
  }
});

// POST /api/players/:id/buy — Acheter un skin
router.post('/:id/buy', async (req, res, next) => {
  try {
    const { skinId } = req.body;

    if (!skinId) {
      return res.status(400).json({ message: 'skinId est requis dans le corps de la requête' });
    }

    // Récupérer le joueur et le skin en parallèle
    const [player, skin] = await Promise.all([
      Player.findById(req.params.id),
      Skin.findById(skinId),
    ]);

    if (!player) return res.status(404).json({ message: 'Joueur introuvable' });
    if (!skin) return res.status(404).json({ message: 'Skin introuvable' });

    // Vérifier si le joueur a assez d'argent
    if (player.solde < skin.prix) {
      return res.status(400).json({
        message: 'Solde insuffisant',
        solde: player.solde,
        prixSkin: skin.prix,
        manque: skin.prix - player.solde,
      });
    }

    // Déduire le prix et ajouter le skin à l'inventaire
    player.solde -= skin.prix;
    player.inventory.push({ skinId: skin._id, dateObtention: new Date() });

    await player.save();

    res.json({
      message: `Skin "${skin.nom}" acheté avec succès !`,
      nouveauSolde: player.solde,
      player,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
