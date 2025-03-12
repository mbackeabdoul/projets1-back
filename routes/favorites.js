// routes/payments.js
const express = require('express');
const router = express.Router();
const PaydunyaService = require('../utils/paydunyaService');

const paydunyaService = new PaydunyaService();

router.post('/paydunya', async (req, res) => {
  const { cartItems, contactInfo, shippingMethod, shippingCost, paymentMethod, total } = req.body;

  if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0 || !total) {
    return res.status(400).json({ success: false, message: 'Missing or invalid required fields' });
  }

  try {
    const invoiceData = {
      invoice: {
        total_amount: total,
        description: 'Paiement pour commande e-commerce'
      },
      store: {
        name: 'Ma Boutique',
        tagline: 'Achat en ligne facile',
        phone_number: '123456789',
        logo_url: 'http://example.com/logo.png',
        url: 'http://example.com'
      },
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity
      })),
      custom_data: { contactInfo, shippingMethod, shippingCost, paymentMethod }
    };

    const response = await paydunyaService.createInvoice(invoiceData);
    if (response.status === 'success' && response.response_text === 'Checkout Invoice Created') {
      res.json({ success: true, redirect_url: response.invoice_url, token: response.token });
    } else {
      res.status(400).json({ success: false, message: response.response_text || 'Failed to create invoice' });
    }
  } catch (error) {
    console.error('Payment Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;