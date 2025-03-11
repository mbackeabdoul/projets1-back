// const express = require('express');
// const router = express.Router();
// const User = require('../models/User'); // Importez le modèle User

// // Exemple : Récupérer tous les utilisateurs
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // Exemple : Récupérer un utilisateur par ID
// router.get('/:id', async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id);
//     if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;