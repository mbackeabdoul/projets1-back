const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

connectDB(); // Cela appellera aussi createDefaultAdmin

app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://votre-domaine.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));

// Ajoutez cette ligne avec vos autres imports de routes
const paymentRoutes = require('./routes/payments');

// Ajoutez cette ligne avec vos autres app.use pour les routes
app.use('/api/payments', paymentRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});