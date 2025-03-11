// const express = require('express');
// const router = express.Router();
// const Order = require('../models/Order');
// const User = require('../models/User');
// const Product = require('../models/Product');
// const auth = require('../middleware/auth');
// const adminAuth = require('../middleware/adminAuth');

// // GET toutes les commandes (admin seulement)
// router.get('/all', auth, adminAuth, async (req, res) => {
//   try {
//     const orders = await Order.find()
//       .populate('user', 'email prenom nom')
//       .populate('items.product');
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET commandes de l'utilisateur connecté
// router.get('/', auth, async (req, res) => {
//   try {
//     const orders = await Order.find({ user: req.user.id })
//       .populate('items.product');
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET détails d'une commande spécifique
// router.get('/:id', auth, async (req, res) => {
//   try {
//     const order = await Order.findById(req.params.id)
//       .populate('items.product');
    
//     // Vérifier si l'utilisateur a le droit de voir cette commande
//     if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
//       return res.status(403).json({ message: 'Accès non autorisé' });
//     }
    
//     res.json(order);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST créer une nouvelle commande
// router.post('/', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).populate('cart.product');
    
//     if (user.cart.length === 0) {
//       return res.status(400).json({ message: 'Le panier est vide' });
//     }
    
//     // Vérifier le stock pour chaque produit
//     for (const item of user.cart) {
//       const product = await Product.findById(item.product._id);
      
//       if (product.stock < item.quantity) {
//         return res.status(400).json({ 
//           message: `Stock insuffisant pour ${product.name}. Disponible: ${product.stock}` 
//         });
//       }
      
//       // Mettre à jour le stock
//       product.stock -= item.quantity;
//       await product.save();
//     }
    
//     // Créer la commande
//     const order = new Order({
//       user: req.user.id,
//       items: user.cart.map(item => ({
//         product: item.product._id,
//         quantity: item.quantity,
//         price: item.price,
//         size: item.size,
//         color: item.color
//       })),
//       shippingAddress: req.body.shippingAddress,
//       billingAddress: req.body.billingAddress || req.body.shippingAddress,
//       paymentMethod: req.body.paymentMethod,
//       totalAmount: user.cart.reduce((total, item) => 
//         total + (item.price * item.quantity), 0),
//       status: 'créée'
//     });
    
//     const savedOrder = await order.save();
    
//     // Vider le panier de l'utilisateur
//     user.cart = [];
//     await user.save();
    
//     res.status(201).json(savedOrder);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // PUT mettre à jour le statut d'une commande (admin seulement)
// router.put('/:id/status', auth, adminAuth, async (req, res) => {
//   try {
//     const { status } = req.body;
//     const validStatuses = ['créée', 'en traitement', 'expédiée', 'livrée', 'annulée'];
    
//     if (!validStatuses.includes(status)) {
//       return res.status(400).json({ message: 'Statut de commande invalide' });
//     }
    
//     const order = await Order.findById(req.params.id);
//     if (!order) {
//       return res.status(404).json({ message: 'Commande non trouvée' });
//     }
    
//     order.status = status;
//     if (status === 'expédiée') {
//       order.shippingDate = Date.now();
//     }
    
//     // Si la commande est annulée, remettre les produits en stock
//     if (status === 'annulée' && order.status !== 'annulée') {
//       for (const item of order.items) {
//         const product = await Product.findById(item.product);
//         product.stock += item.quantity;
//         await product.save();
//       }
//     }
    
//     await order.save();
//     res.json(order);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// module.exports = router;