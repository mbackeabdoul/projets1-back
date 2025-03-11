// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Product = require('../models/Product');
// const auth = require('../middleware/auth');

// // GET panier de l'utilisateur
// router.get('/', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate('cart.product');
//     res.json(user.cart);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST ajouter un produit au panier
// router.post('/add', auth, async (req, res) => {
//   try {
//     const { productId, quantity, size, color } = req.body;
    
//     // Vérifier si le produit existe et s'il y a assez de stock
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Produit non trouvé' });
//     }
    
//     if (product.stock < quantity) {
//       return res.status(400).json({ message: 'Stock insuffisant' });
//     }
    
//     const user = await User.findById(req.user.id);
    
//     // Vérifier si le produit est déjà dans le panier
//     const cartItemIndex = user.cart.findIndex(item => 
//       item.product.toString() === productId && 
//       item.size === size && 
//       item.color === color
//     );
    
//     if (cartItemIndex > -1) {
//       // Mettre à jour la quantité si le produit existe déjà
//       user.cart[cartItemIndex].quantity += quantity;
//     } else {
//       // Ajouter un nouveau produit
//       user.cart.push({
//         product: productId,
//         quantity,
//         size,
//         color,
//         price: product.onSale ? product.salePrice : product.price
//       });
//     }
    
//     await user.save();
    
//     // Renvoyer le panier mis à jour avec les détails des produits
//     const updatedUser = await User.findById(req.user.id).populate('cart.product');
//     res.status(200).json(updatedUser.cart);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // PUT mettre à jour la quantité d'un produit
// router.put('/update/:itemId', auth, async (req, res) => {
//   try {
//     const { quantity } = req.body;
//     const user = await User.findById(req.user.id);
    
//     const cartItem = user.cart.id(req.params.itemId);
//     if (!cartItem) {
//       return res.status(404).json({ message: 'Produit non trouvé dans le panier' });
//     }
    
//     // Vérifier le stock
//     const product = await Product.findById(cartItem.product);
//     if (product.stock < quantity) {
//       return res.status(400).json({ message: 'Stock insuffisant' });
//     }
    
//     cartItem.quantity = quantity;
//     await user.save();
    
//     const updatedUser = await User.findById(req.user.id).populate('cart.product');
//     res.status(200).json(updatedUser.cart);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // DELETE supprimer un produit du panier
// router.delete('/remove/:itemId', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
    
//     user.cart = user.cart.filter(item => item._id.toString() !== req.params.itemId);
//     await user.save();
    
//     const updatedUser = await User.findById(req.user.id).populate('cart.product');
//     res.status(200).json(updatedUser.cart);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // DELETE vider le panier
// router.delete('/clear', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     user.cart = [];
//     await user.save();
//     res.status(200).json({ message: 'Panier vidé' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;