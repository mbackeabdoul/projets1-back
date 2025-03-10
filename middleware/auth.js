const jwt = require("jsonwebtoken")
const User = require("../models/User")

// Middleware pour vérifier le token JWT
const auth = async (req, res, next) => {
  try {
    let token

    // Vérifier si le token est présent dans les headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return res.status(401).json({ message: "Non autorisé, token manquant" })
    }

    // Vérifier le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    req.user = decoded;
    // Ajouter l'utilisateur à la requête
    // req.user = await User.findById(decoded.id).select("-password")

    // if (!req.user) {
    //   return res.status(401).json({ message: "Non autorisé, utilisateur non trouvé" })
    // }

    next()
  } catch (error) {
    console.error("Erreur d'authentification:", error)
    res.status(401).json({ message: "Non autorisé, token invalide" })
  }
}

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403).json({ message: "Non autorisé, accès administrateur requis" })
  }
}

module.exports = { auth, isAdmin }

