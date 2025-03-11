// Au début de controllers/paymentController.js
const PaydunyaService = require('../utils/paydunyaService');
const Payment = require('../models/payment');
// const Order = require('../models/order'); // Si vous avez un modèle d'ordre séparé
// const User = require('../models/user'); // Pour accéder aux informations utilisateur

const paydunya = new PaydunyaService();
/**
 * Crée une nouvelle demande de paiement via PayDunya
 */
exports.createPayment = async (req, res) => {
  try {
    const { items, customer, totalAmount, shippingAddress } = req.body;
    
    // Générer un ID de commande unique
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Préparation des articles pour PayDunya
    const paydunyaItems = items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.quantity * item.price,
    }));
    
    const invoiceData = {
      invoice: {
        items: paydunyaItems,
        total_amount: totalAmount,
        description: "Commande depuis Landing Page"
      },
      store: {
        name: process.env.STORE_NAME || "Votre Boutique",
        tagline: process.env.STORE_TAGLINE || "Slogan de la boutique",
        phone: process.env.STORE_PHONE || "+221XXXXXXXXX",
        postal_address: process.env.STORE_ADDRESS || "Votre adresse",
        website_url: process.env.FRONTEND_URL || "https://votresite.com"
      },
      custom_data: {
        customer_id: customer.id,
        order_id: orderId
      },
      actions: {
        callback_url: `${process.env.BACKEND_URL}/api/payments/callback`,
        return_url: `${process.env.FRONTEND_URL}/payment-success?orderId=${orderId}`,
        cancel_url: `${process.env.FRONTEND_URL}/payment-cancel?orderId=${orderId}`
      }
    };

    const response = await paydunya.createInvoice(invoiceData);
    
    if (response.success) {
      // Enregistrer le paiement dans la base de données
      const newPayment = new Payment({
        orderId: orderId,
        paydunyaToken: response.token,
        amount: totalAmount,
        customerId: customer.id,
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
          name: item.name
        })),
        shippingAddress: shippingAddress,
        status: 'pending'
      });
      
      await newPayment.save();
      
      res.status(200).json({
        success: true,
        token: response.token,
        url: response.response_text,
        orderId: orderId
      });
    } else {
      res.status(400).json({
        success: false,
        message: response.response_text
      });
    }
  } catch (error) {
    console.error('Erreur création paiement:', error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la création du paiement",
      error: error.message
    });
  }
};

/**
 * Vérifie le statut d'un paiement
 */
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { token } = req.params;
    
    // Vérifier d'abord dans notre base de données
    const payment = await Payment.findOne({ paydunyaToken: token });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Paiement non trouvé"
      });
    }
    
    // Vérifier le statut auprès de PayDunya
    const response = await paydunya.checkInvoiceStatus(token);
    
    if (response.success) {
      // Mettre à jour le statut dans notre base de données si nécessaire
      if (payment.status !== response.status) {
        payment.status = response.status === 'completed' ? 'completed' : 
                          response.status === 'cancelled' ? 'cancelled' : payment.status;
        payment.updatedAt = new Date();
        await payment.save();
      }
    }
    
    res.status(200).json({
      success: true,
      payment: {
        orderId: payment.orderId,
        status: payment.status,
        amount: payment.amount,
        createdAt: payment.createdAt,
        paydunyaStatus: response.status,
        paydunyaResponse: response
      }
    });
  } catch (error) {
    console.error('Erreur vérification statut:', error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la vérification du paiement",
      error: error.message
    });
  }
};

/**
 * Traitement du callback de PayDunya
 */
exports.paymentCallback = async (req, res) => {
  try {
    const { data } = req.body;
    
    if (!data || !data.custom_data || !data.custom_data.order_id) {
      return res.status(400).json({ 
        success: false, 
        message: 'Données de callback incomplètes' 
      });
    }
    
    // Récupérer l'ID de commande depuis les données de callback
    const orderId = data.custom_data.order_id;
    
    // Mettre à jour le statut de la commande dans la base de données
    const payment = await Payment.findOne({ orderId: orderId });
    
    if (payment) {
      const previousStatus = payment.status;
      payment.status = data.status === 'completed' ? 'completed' : 
                       data.status === 'cancelled' ? 'cancelled' : 'failed';
      payment.updatedAt = new Date();
      
      // Enregistrer les détails de la transaction
      payment.transactionDetails = {
        transactionId: data.transaction_id || null,
        receiptUrl: data.receipt_url || null,
        paymentMethod: data.payment_method || null,
        paymentDate: new Date()
      };
      
      await payment.save();
      
      // Si le paiement vient d'être complété, mettre à jour le stock
      if (previousStatus !== 'completed' && payment.status === 'completed') {
        await updateProductInventory(payment.items);
        
        // Créer une commande confirmée si vous avez un modèle d'ordre séparé
        if (typeof Order !== 'undefined') {
          const newOrder = new Order({
            orderId: payment.orderId,
            customerId: payment.customerId,
            items: payment.items,
            totalAmount: payment.amount,
            shippingAddress: payment.shippingAddress,
            paymentId: payment._id,
            status: 'confirmed'
          });
          
          await newOrder.save();
        }
        
        // Vous pourriez envoyer un email de confirmation ici
      }
      
      res.status(200).json({ success: true });
    } else {
      res.status(404).json({ success: false, message: 'Paiement non trouvé' });
    }
  } catch (error) {
    console.error('Erreur callback:', error);
    res.status(500).json({
      success: false,
      message: "Erreur lors du traitement du callback",
      error: error.message
    });
  }
};

/**
 * Récupère l'historique des paiements pour un utilisateur
 */
exports.getPaymentHistory = async (req, res) => {
  try {
    // L'ID utilisateur devrait être disponible via le middleware d'authentification
    const customerId = req.user.id;
    
    const payments = await Payment.find({ customerId })
      .sort({ createdAt: -1 })
      .select('-__v'); // Exclure les champs inutiles
    
    res.status(200).json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error) {
    console.error('Erreur historique paiements:', error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la récupération de l'historique des paiements",
      error: error.message
    });
  }
};

/**
 * Récupère les détails d'un paiement spécifique
 */
exports.getPaymentDetails = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user.id;
    
    const payment = await Payment.findOne({ 
      orderId, 
      customerId 
    });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Paiement non trouvé"
      });
    }
    
    res.status(200).json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Erreur détails paiement:', error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la récupération des détails du paiement",
      error: error.message
    });
  }
};

/**
 * Annule un paiement en attente
 */
exports.cancelPayment = async (req, res) => {
  try {
    const { orderId } = req.params;
    const customerId = req.user.id;
    
    const payment = await Payment.findOne({
      orderId,
      customerId,
      status: 'pending' // On ne peut annuler que les paiements en attente
    });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Paiement non trouvé ou non annulable"
      });
    }
    
    // Vous pourriez ajouter ici une API pour annuler le paiement chez PayDunya
    // si elle est disponible
    
    payment.status = 'cancelled';
    payment.updatedAt = new Date();
    await payment.save();
    
    res.status(200).json({
      success: true,
      message: "Paiement annulé avec succès"
    });
  } catch (error) {
    console.error('Erreur annulation paiement:', error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de l'annulation du paiement",
      error: error.message
    });
  }
};

/**
 * Récupère les statistiques de paiement (pour admin)
 */
exports.getPaymentStats = async (req, res) => {
  try {
    // Vérifier que l'utilisateur est un admin
    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Accès refusé: vous n'avez pas les droits d'administrateur"
      });
    }
    
    // Statistiques générales
    const totalPayments = await Payment.countDocuments();
    const completedPayments = await Payment.countDocuments({ status: 'completed' });
    const pendingPayments = await Payment.countDocuments({ status: 'pending' });
    const failedPayments = await Payment.countDocuments({ status: 'failed' });
    
    // Montant total des paiements réussis
    const totalRevenue = await Payment.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    // Paiements récents
    const recentPayments = await Payment.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('customerId', 'name email'); // Supposons que vous voulez le nom et l'email du client
    
    res.status(200).json({
      success: true,
      stats: {
        totalPayments,
        completedPayments,
        pendingPayments,
        failedPayments,
        completionRate: (completedPayments / totalPayments * 100).toFixed(2),
        totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0
      },
      recentPayments
    });
  } catch (error) {
    console.error('Erreur statistiques paiements:', error);
    res.status(500).json({
      success: false,
      message: "Une erreur est survenue lors de la récupération des statistiques de paiement",
      error: error.message
    });
  }
};

/**
 * Fonction utilitaire pour mettre à jour le stock des produits
 */
async function updateProductInventory(items) {
  try {
    const Product = require('../models/Product');
    
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }
  } catch (error) {
    console.error('Erreur mise à jour stock:', error);
    // Gérer l'erreur selon votre stratégie
  }
}