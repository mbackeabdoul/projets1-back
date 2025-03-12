const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware d'authentification
const auth = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1]; // Récupérer uniquement le token

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password"); // Exclure le mot de passe

      next();
    } catch (error) {
      console.error("Erreur d'authentification:", error);
      return res.status(401).json({ message: "Token invalide ou expiré" });
    }
  } else {
    return res.status(401).json({ message: "Non autorisé, token manquant" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(403).json({ message: "Non autorisé, accès administrateur requis" })
  }
}

module.exports = { auth, isAdmin };
