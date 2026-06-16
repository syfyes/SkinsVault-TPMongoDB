const mongoose = require('mongoose');

const skinSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: [true, 'Le nom du skin est obligatoire'],
      trim: true,
    },
    rarete: {
      type: String,
      required: [true, 'La rareté est obligatoire'],
      enum: {
        values: ['commun', 'Rare', 'Epique', 'Legendaire'],
        message: "La rareté '{VALUE}' est invalide. Valeurs acceptées : commun, Rare, Epique, Legendaire",
      },
    },
    prix: {
      type: Number,
      required: [true, 'Le prix est obligatoire'],
      min: [0, 'Le prix ne peut pas être négatif'],
    },
    image: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Skin', skinSchema);
