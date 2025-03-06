const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.register = async (req, res) => {
    try {
      const { prenom, nom, email, password } = req.body;
      
      // Log des données reçues
      console.log('Données reçues:', { prenom, nom, email });
  
      // Vérifier si l'utilisateur existe déjà
      let user = await User.findOne({ email });
      if (user) {
        console.log('Utilisateur existe déjà');
        return res.status(400).json({ message: 'Utilisateur déjà existant' });
      }
  
      // Créer un nouvel utilisateur
      user = new User({ prenom, nom, email, password });
      
      // Log avant la sauvegarde
      console.log('Tentative de sauvegarde de l\'utilisateur');
      
      await user.save();
      
      // Log après la sauvegarde
      console.log('Utilisateur sauvegardé avec succès', user);
  
      // Générer un token JWT
      const token = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.status(201).json({
        id: user._id,
        prenom: user.prenom,
        nom: user.nom,
        email: user.email,
        token
      });
    } catch (error) {
      // Log de l'erreur détaillée
      console.error('Erreur lors de l\'inscription:', error);
      
      // Gestion des erreurs de validation Mongoose
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ 
          message: 'Erreur de validation', 
          errors: messages 
        });
      }
  
      res.status(500).json({ 
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  };

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Vérifier le mot de passe
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({
      id: user._id,
      prenom: user.prenom,
      nom: user.nom,
      email: user.email,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Aucun utilisateur trouvé' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("Lien de réinitialisation:", resetURL);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USERNAME,
      to: user.email,
      subject: 'Réinitialisation de mot de passe',
      text: `Cliquez sur ce lien pour réinitialiser votre mot de passe : ${resetURL}`
    });

    res.status(200).json({ message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    console.error("Erreur dans forgotPassword:", error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
    try {
      const { token, newPassword } = req.body;
  
      // Hash the reset token for comparison
      const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');
  
      // Find user with matching reset token that hasn't expired
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
      });
  
      // If no user found or token expired
      if (!user) {
        return res.status(400).json({ 
          message: 'Lien de réinitialisation invalide ou expiré' 
        });
      }
  
      // Set new password
      user.password = newPassword;
      
      // Clear reset token fields
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
  
      // Save the user with the new password
      await user.save();
  
      res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
    } catch (error) {
      console.error("Erreur dans resetPassword:", error);
      res.status(500).json({ 
        message: 'Erreur serveur', 
        error: error.message 
      });
    }
  };