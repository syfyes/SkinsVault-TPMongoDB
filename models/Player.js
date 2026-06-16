const mongoose = require('mongoose');

// Sous-document pour chaque entrée d'inventaire
const inventoryItemSchema = new mongoose.Schema(
  {
    skinId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Skin',
      required: true,
    },
    dateObtention: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false } // pas besoin d'un _id sur chaque item
);

const playerSchema = new mongoose.Schema(
  {
    pseudo: {
      type: String,
      required: [true, 'Le pseudo est obligatoire'],
      trim: true,                          // supprime les espaces superflus
      unique: true,
      minlength: [3, 'Le pseudo doit faire au moins 3 caractères'],
    },
    solde: {
      type: Number,
      required: [true, 'Le solde initial est obligatoire'],
      min: [0, 'Le solde ne peut pas être négatif'],
      default: 0,
    },
    inventory: {
      type: [inventoryItemSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Player', playerSchema);
