const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); 
const { auth, isAdmin } = require('../middleware/auth');

// Obtenir tous les produits (public)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Ajouter un produit (admin seulement)
router.post('/', [auth, isAdmin], async (req, res) => {
  const { name, price, image, description, category } = req.body;
  try {
    const product = new Product({ name, price, image, description, category });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la création' });
  }
});

// Mettre à jour un produit (admin seulement)
router.put('/:id', [auth, isAdmin], async (req, res) => {
  const { name, price, image, description, category } = req.body;
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, price, image, description, category },
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour' });
  }
});

// Supprimer un produit (admin seulement)
router.delete('/:id', [auth, isAdmin], async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;