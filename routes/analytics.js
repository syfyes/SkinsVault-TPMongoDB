const express = require('express');
const router = express.Router();
const Player = require('../models/Player');

// GET /api/analytics/wealth — Classement des joueurs par valeur d'inventaire
router.get('/wealth', async (req, res, next) => {
  try {
    const wealth = await Player.aggregate([
      // Étape 1 : Aplatir le tableau inventory (1 doc par skin possédé)
      {
        $unwind: {
          path: '$inventory',
          preserveNullAndEmptyArrays: true, // Garder les joueurs sans inventaire
        },
      },

      // Étape 2 : Jointure avec la collection skins pour obtenir le prix
      {
        $lookup: {
          from: 'skins',          // Nom de la collection MongoDB (minuscule + pluriel)
          localField: 'inventory.skinId',
          foreignField: '_id',
          as: 'skinDetails',
        },
      },

      // Étape 3 : Décomposer le tableau skinDetails (toujours 0 ou 1 élément)
      {
        $unwind: {
          path: '$skinDetails',
          preserveNullAndEmptyArrays: true,
        },
      },

      // Étape 4 : Grouper par joueur et sommer la valeur de l'inventaire
      {
        $group: {
          _id: '$_id',
          pseudo: { $first: '$pseudo' },
          solde: { $first: '$solde' },
          nombreSkins: { $sum: { $cond: [{ $ifNull: ['$skinDetails', false] }, 1, 0] } },
          valeurInventaire: {
            $sum: { $ifNull: ['$skinDetails.prix', 0] },
          },
        },
      },

      // Étape 5 : Calculer la fortune totale (solde + valeur inventaire)
      {
        $addFields: {
          fortuneTotale: { $add: ['$solde', '$valeurInventaire'] },
        },
      },

      // Étape 6 : Trier par fortune totale décroissante
      {
        $sort: { fortuneTotale: -1 },
      },

      // Étape 7 : Projeter les champs utiles
      {
        $project: {
          _id: 1,
          pseudo: 1,
          solde: 1,
          nombreSkins: 1,
          valeurInventaire: 1,
          fortuneTotale: 1,
        },
      },
    ]);

    res.json(wealth);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
