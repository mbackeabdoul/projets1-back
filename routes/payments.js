const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { auth } = require('../middleware/auth'); // Changez auth.verifyToken en auth
const { isAdmin } = require('../middleware/auth'); // Importez isAdmin depuis le même fichier

// Route pour créer un paiement
router.post('/create', auth, paymentController.createPayment);

// Route pour vérifier le statut d'un paiement
router.get('/status/:token', auth, paymentController.checkPaymentStatus);

// Route de callback pour PayDunya (pas besoin d'authentification)
router.post('/callback', paymentController.paymentCallback);

// Route pour obtenir l'historique des paiements d'un utilisateur
router.get('/history', auth, paymentController.getPaymentHistory);

// Route pour obtenir les détails d'un paiement spécifique
router.get('/details/:orderId', auth, paymentController.getPaymentDetails);

// Route pour annuler un paiement en attente
router.post('/cancel/:orderId', auth, paymentController.cancelPayment);

// Route pour obtenir les statistiques de paiement (admin seulement)
router.get('/stats', auth, isAdmin, paymentController.getPaymentStats);

module.exports = router;