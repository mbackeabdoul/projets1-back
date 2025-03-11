// adminAuth.js - Middleware pour vérifier les droits d'administrateur
module.exports = function(req, res, next) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé, droits administrateur requis' });
  }
};
