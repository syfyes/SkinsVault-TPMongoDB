# SkinsVault — Marketplace de skins

Mini-application full-stack de gestion de catalogue de skins de jeux vidéo avec inventaires joueurs.

## Stack technique

- **Back-end** : Node.js + Express.js
- **ODM** : Mongoose
- **Base de données** : MongoDB Atlas (Cloud)
- **Front-end** : HTML/CSS/JS vanilla (fetch API)

## Prérequis

- Node.js v18+
- npm
- Un cluster MongoDB Atlas actif

## Installation

```bash
# 1. Cloner le dépôt
git clone <url-du-repo>
cd skinsvault

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env
# Éditer .env et renseigner votre URI MongoDB Atlas
```

## Configuration

Dans le fichier `.env` à la racine :

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/skinsvault?retryWrites=true&w=majority
PORT=3000
```

## Lancer l'application

```bash
# Mode production
npm start

# Mode développement (rechargement automatique)
npm run dev
```

L'application est accessible sur `http://localhost:3000`

## API REST — Endpoints

### Skins

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/skins` | Liste tous les skins du catalogue |
| GET | `/api/skins/:id` | Détail d'un skin |
| POST | `/api/skins` | Créer un nouveau skin |
| PUT | `/api/skins/:id` | Mettre à jour un skin |
| DELETE | `/api/skins/:id` | Supprimer un skin |

**Corps POST/PUT :**
```json
{
  "nom": "Dragon Inferno",
  "rarete": "Legendaire",
  "prix": 1500
}
```

Valeurs `rarete` acceptées : `commun`, `Rare`, `Epique`, `Legendaire`

### Joueurs

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/players` | Liste tous les joueurs |
| GET | `/api/players/:id` | Détail d'un joueur (inventaire peuplé) |
| POST | `/api/players` | Créer un nouveau joueur |
| POST | `/api/players/:id/buy` | Acheter un skin |

**Corps POST joueur :**
```json
{
  "pseudo": "ShadowBlade42",
  "solde": 2000
}
```

**Corps POST /buy :**
```json
{
  "skinId": "<id_du_skin>"
}
```

### Analytics

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/analytics/wealth` | Classement des joueurs par fortune totale |

## Architecture du projet

```
skinsvault/
├── models/
│   ├── Skin.js          # Modèle Mongoose skin (nom, rareté, prix)
│   └── Player.js        # Modèle Mongoose joueur + inventory (sous-documents)
├── routes/
│   ├── skins.js         # CRUD complet skins
│   ├── players.js       # CRUD joueurs + route d'achat
│   └── analytics.js     # Pipeline d'agrégation wealth
├── middleware/
│   └── errorHandler.js  # Middleware d'erreur global Express
├── public/
│   └── index.html       # Front-end SPA (HTML/CSS/JS)
├── server.js            # Point d'entrée, connexion Atlas, configuration pool
├── .env.example         # Template variables d'environnement
├── .gitignore
└── README.md
```

## Fonctionnalités

- Catalogue de skins avec filtres par rareté
- Création de joueurs avec solde initial
- Achat de skins avec vérification du solde
- Dashboard de classement avec pipeline d'agrégation MongoDB
- Validation stricte des schémas Mongoose
- Gestion globale des erreurs (400/404/409/500)
- Connection pool MongoDB configuré explicitement
