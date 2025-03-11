// controllers/favoriteController.js
const Favorite = require('../models/favorite');
const Product = require('../models/Product'); // Supposons que vous avez un modèle de produit

// Ajouter un produit aux favoris
exports.addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Vérifier si le produit existe
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé"
      });
    }

    // Vérifier si le produit est déjà dans les favoris
    const existingFavorite = await Favorite.findOne({ userId, productId });
    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: "Ce produit est déjà dans vos favoris"
      });
    }

    // Créer un nouveau favori
    const favorite = new Favorite({
      userId,
      productId
    });

    await favorite.save();

    res.status(201).json({
      success: true,
      message: "Produit ajouté aux favoris avec succès",
      favorite
    });
  } catch (error) {
    console.error('Erreur ajout favori:', error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de l'ajout aux favoris",
      error: error.message
    });
  }
};

// Récupérer tous les favoris d'un utilisateur
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.find({ userId })
      .populate('productId', 'name price images description'); // Récupérer les détails du produit

    res.status(200).json({
      success: true,
      count: favorites.length,
      favorites
    });
  } catch (error) {
    console.error('Erreur récupération favoris:', error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la récupération des favoris",
      error: error.message
    });
  }
};

// Supprimer un favori
exports.removeFavorite = async (req, res) => {
  try {
    const { favoriteId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({
      _id: favoriteId,
      userId
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: "Favori non trouvé"
      });
    }

    await Favorite.findByIdAndDelete(favoriteId);

    res.status(200).json({
      success: true,
      message: "Produit supprimé des favoris avec succès"
    });
  } catch (error) {
    console.error('Erreur suppression favori:', error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la suppression du favori",
      error: error.message
    });
  }
};

// Vérifier si un produit est dans les favoris
exports.checkFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    const favorite = await Favorite.findOne({ userId, productId });

    res.status(200).json({
      success: true,
      isFavorite: !!favorite,
      favorite
    });
  } catch (error) {
    console.error('Erreur vérification favori:', error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la vérification du favori",
      error: error.message
    });
  }
};