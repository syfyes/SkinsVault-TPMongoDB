require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const skinsRouter = require('./routes/skins');
const playersRouter = require('./routes/players');
const analyticsRouter = require('./routes/analytics');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares globaux ───────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─── Routes API ───────────────────────────────────────────────────────────────
app.use('/api/skins', skinsRouter);
app.use('/api/players', playersRouter);
app.use('/api/analytics', analyticsRouter);

// Route racine — sert le front
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Middleware d'erreur global (doit être en dernier) ────────────────────────
app.use(errorHandler);

// ─── Connexion MongoDB Atlas avec configuration du Connection Pool ─────────────
const mongoOptions = {
  // Configuration explicite du pool de connexions
  maxPoolSize: 10,        // Nombre maximum de connexions simultanées
  minPoolSize: 2,         // Connexions maintenues en attente
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

mongoose
  .connect(process.env.MONGODB_URI, mongoOptions)
  .then(() => {
    console.log('✅ Connecté à MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erreur de connexion MongoDB :', err.message);
    process.exit(1);
  });
