const express = require('express');
const router = express.Router();
const { 
  register, 
  login, 
  forgotPassword,
  resetPassword
} = require('../controllers/authController');
const { auth } = require('../middleware/auth'); // Importe le middleware auth

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Route temporaire pour promouvoir un utilisateur en admin
router.post('/make-admin', auth, async (req, res) => {
  try {
    const User = require('../models/User'); // Importe le modèle User ici
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    user.role = 'admin';
    await user.save();
    res.json({ message: 'Utilisateur promu admin', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;