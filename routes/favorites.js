// routes/favorites.js
const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { auth } = require('../middleware/auth');

// Ajouter un produit aux favoris
router.post('/add', auth, favoriteController.addFavorite);

// Récupérer tous les favoris d'un utilisateur
router.get('/', auth, favoriteController.getFavorites);

// Supprimer un favori
router.delete('/:favoriteId', auth, favoriteController.removeFavorite);

// Vérifier si un produit est dans les favoris
router.get('/check/:productId', auth, favoriteController.checkFavorite);

module.exports = router;