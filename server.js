const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connexion à la base de données
connectDB();

// Middleware pour analyser les données JSON dans les requêtes
app.use(express.json()); // <-- Ajoute cette ligne

// Middleware CORS
app.use(cors({
  origin: ['http://localhost:3000', 'https://votre-domaine.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
