require('dotenv').config();
const mongoose = require('mongoose');
const Skin = require('./models/Skin');

const lolSkins = [
  // ── COMMUNS ────────────────────────────────────────────────
  { nom: 'Guerrier Alistar', rarete: 'commun', prix: 290, image: '🐂' },
  { nom: 'Comte Garen', rarete: 'commun', prix: 290, image: '⚔️' },
  { nom: 'Maître Yi Chasseur', rarete: 'commun', prix: 290, image: '🗡️' },
  { nom: 'Teemo Forestier', rarete: 'commun', prix: 290, image: '🍄' },
  { nom: 'Nasus Dogue', rarete: 'commun', prix: 390, image: '🐕' },
  { nom: 'Ashe Reines des Glaces', rarete: 'commun', prix: 390, image: '🏹' },

  // ── RARES ──────────────────────────────────────────────────
  { nom: 'Jinx Apprentie Criminelle', rarete: 'Rare', prix: 750, image: '💥' },
  { nom: 'Lux Élémentariste', rarete: 'Rare', prix: 750, image: '✨' },
  { nom: 'Ezreal Explorateur', rarete: 'Rare', prix: 750, image: '🔮' },
  { nom: 'Yasuo Banni', rarete: 'Rare', prix: 975, image: '🌪️' },
  { nom: 'Thresh Geôlier des Ombres', rarete: 'Rare', prix: 975, image: '⛓️' },
  { nom: 'Ahri Renarde des Neiges', rarete: 'Rare', prix: 975, image: '🦊' },
  { nom: 'Zed Maître des Ombres', rarete: 'Rare', prix: 975, image: '🌑' },
  { nom: 'Lee Sin Moine Aveugle', rarete: 'Rare', prix: 750, image: '👊' },

  // ── ÉPIQUES ────────────────────────────────────────────────
  { nom: 'Jinx Arcane', rarete: 'Epique', prix: 1350, image: '🚀' },
  { nom: 'Vi Arcane', rarete: 'Epique', prix: 1350, image: '🤜' },
  { nom: 'Lux Élémentariste Feu', rarete: 'Epique', prix: 1350, image: '🔥' },
  { nom: 'Thresh Projet', rarete: 'Epique', prix: 1350, image: '🤖' },
  { nom: 'Yasuo Maître du Chaos', rarete: 'Epique', prix: 1350, image: '⚡' },
  { nom: 'Ahri K/DA', rarete: 'Epique', prix: 1350, image: '🎤' },
  { nom: 'Kai\'Sa K/DA', rarete: 'Epique', prix: 1350, image: '💜' },
  { nom: 'Akali K/DA', rarete: 'Epique', prix: 1350, image: '🎭' },
  { nom: 'Ezreal Pulsefire', rarete: 'Epique', prix: 1350, image: '⏱️' },
  { nom: 'Caitlyn Arcane', rarete: 'Epique', prix: 1350, image: '🎯' },
  { nom: 'Zed Projet', rarete: 'Epique', prix: 1350, image: '💀' },
  { nom: 'Ekko Projet', rarete: 'Epique', prix: 1350, image: '🕐' },

  // ── LÉGENDAIRES ────────────────────────────────────────────
  { nom: 'Lux Élémentariste (Ultime)', rarete: 'Legendaire', prix: 3250, image: '🌈' },
  { nom: 'Udyr Esprit du Gardien (Ultime)', rarete: 'Legendaire', prix: 3250, image: '🐉' },
  { nom: 'Miss Fortune Bateau Pirate', rarete: 'Legendaire', prix: 1820, image: '🏴‍☠️' },
  { nom: 'Thresh Championnat 2022', rarete: 'Legendaire', prix: 1820, image: '🏆' },
  { nom: 'Jinx Crime City Nightmare', rarete: 'Legendaire', prix: 1820, image: '🌆' },
  { nom: 'Yasuo Maître du Vent Vérité', rarete: 'Legendaire', prix: 1820, image: '🌬️' },
  { nom: 'Ahri Étoile Gardienne', rarete: 'Legendaire', prix: 1820, image: '⭐' },
  { nom: 'Kai\'Sa Astronaute', rarete: 'Legendaire', prix: 1820, image: '🚀' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    console.log('✅ Connecté à MongoDB Atlas');

    // Supprimer les skins existants pour repartir propre
    const deleted = await Skin.deleteMany({});
    console.log(`🗑️  ${deleted.deletedCount} skins supprimés`);

    // Insérer tous les skins LoL
    const inserted = await Skin.insertMany(lolSkins);
    console.log(`🎮 ${inserted.length} skins League of Legends insérés !\n`);

    // Afficher le récap par rareté
    const recap = lolSkins.reduce((acc, s) => {
      acc[s.rarete] = (acc[s.rarete] || 0) + 1;
      return acc;
    }, {});
    console.log('📊 Récap :');
    Object.entries(recap).forEach(([r, n]) => console.log(`   ${r} : ${n} skins`));

    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur :', err.message);
    process.exit(1);
  }
}

seed();