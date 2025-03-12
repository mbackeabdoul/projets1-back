// routes/favorites.js
const express = require('express');
const router = express.Router();
const { addFavorite,
  getFavorites,
  checkFavorite,
  removeFavorite,} = require('../controllers/favoriteController');
const { auth } = require('../middleware/auth');

// Ajouter un produit aux favoris
router.post('/add', auth, addFavorite);

// Récupérer tous les favoris d'un utilisateur
router.get('/', auth, getFavorites);

// Supprimer un favori
router.delete('/:favoriteId', auth, removeFavorite);

// Vérifier si un produit est dans les favoris
router.get('/check/:productId', auth, checkFavorite);

module.exports = router;