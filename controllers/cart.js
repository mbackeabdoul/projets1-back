// const Cart = require('../models/Cart');

// const getCart = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
//     if (!cart) {
//       return res.status(404).json({ message: 'Panier non trouvé' });
//     }
//     res.json(cart.items);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

// const addToCart = async (req, res) => {
//   try {
//     const { productId, color, size, quantity } = req.body;
//     const userId = req.user._id;

//     let cart = await Cart.findOne({ userId });
//     if (!cart) {
//       cart = new Cart({ userId, items: [] });
//     }

//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).json({ message: 'Produit non trouvé' });
//     }

//     const existingItemIndex = cart.items.findIndex(
//       item => item.productId.toString() === productId && item.color === color && item.size === size
//     );

//     if (existingItemIndex !== -1) {
//       cart.items[existingItemIndex].quantity += quantity;
//     } else {
//       cart.items.push({ productId, name: product.name, color, size, price: product.price, quantity, image: product.image });
//     }

//     await cart.save();
//     res.status(201).json(cart.items);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

// const updateCartItem = async (req, res) => {
//   try {
//     const { productId, color, size, quantity } = req.body;
//     const userId = req.user._id;

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({ message: 'Panier non trouvé' });
//     }

//     const itemIndex = cart.items.findIndex(
//       item => item.productId.toString() === productId && item.color === color && item.size === size
//     );

//     if (itemIndex !== -1) {
//       cart.items[itemIndex].quantity = quantity;
//       await cart.save();
//       res.json(cart.items);
//     } else {
//       res.status(404).json({ message: 'Item non trouvé dans le panier' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

// const removeCartItem = async (req, res) => {
//   try {
//     const { productId, color, size } = req.params;
//     const userId = req.user._id;

//     const cart = await Cart.findOne({ userId });
//     if (!cart) {
//       return res.status(404).json({ message: 'Panier non trouvé' });
//     }

//     cart.items = cart.items.filter(
//       item => !(item.productId.toString() === productId && item.color === color && item.size === size)
//     );

//     await cart.save();
//     res.json(cart.items);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Erreur serveur' });
//   }
// };

// module.exports = { getCart, addToCart, updateCartItem, removeCartItem };