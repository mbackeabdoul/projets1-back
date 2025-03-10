const User = require("../models/User")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcryptjs")

// @desc    Authentifier un utilisateur et obtenir un token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Vérifier si l'utilisateur existe
    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "Email ou mot de passe invalide" })
    }

    // Vérifier si le mot de passe correspond
    const isMatch = await user.comparePassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: "Email ou mot de passe invalide" })
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "30d" })

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    })
  } catch (error) {
    console.error("Erreur lors de la connexion:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// @desc    Enregistrer un nouvel utilisateur
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Vérifier si l'utilisateur existe déjà
    const userExists = await User.findOne({ email })

    if (userExists) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" })
    }

      

    // Créer un nouvel utilisateur
    const user = await User.create({
      name,
      email,
      password,
    })

    // Générer un token JWT
    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "30d" })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token,
    })
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// @desc    Obtenir le profil de l'utilisateur
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password")

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" })
    }

    res.json(user)
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

module.exports = {
  login,
  register,
  getUserProfile,
}

