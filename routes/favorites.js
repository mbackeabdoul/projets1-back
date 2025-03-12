// routes/favorites.js
const express = require("express");
const router = express.Router();
const {
  addFavorite,
  getFavorites,
  checkFavorite,
  removeFavorite,
  removeFavoriteByProductId, // Doit être importé ici
} = require("../controllers/favoriteController");
const { auth } = require("../middleware/auth");

// Ajouter un produit aux favoris
router.post("/add", auth, addFavorite);

// Récupérer tous les favoris d'un utilisateur
router.get("/", auth, getFavorites);

// Supprimer un favori par ID
router.delete("/:favoriteId", auth, removeFavorite);

// Supprimer un favori par productId
router.delete("/remove/:productId", auth, removeFavoriteByProductId);

// Vérifier si un produit est dans les favoris
router.get("/check/:productId", auth, checkFavorite);

module.exports = router;