/**
 * Middleware d'erreur global Express
 * Gère les erreurs Mongoose (validation, cast, duplicate) et les erreurs génériques
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.name}: ${err.message}`);

  // Erreurs de validation Mongoose
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e) => ({
      champ: e.path,
      message: e.message,
    }));
    return res.status(400).json({
      error: 'Données invalides',
      details: errors,
    });
  }

  // Erreur de cast (ex: ID MongoDB invalide)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Identifiant invalide',
      message: `La valeur "${err.value}" n'est pas un ID valide`,
    });
  }

  // Erreur de doublon (ex: pseudo unique)
  if (err.code === 11000) {
    const champ = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: 'Conflit',
      message: `La valeur du champ "${champ}" est déjà utilisée`,
    });
  }

  // Erreur générique
  res.status(err.status || 500).json({
    error: err.message || 'Erreur interne du serveur',
  });
};

module.exports = errorHandler;
