// app/api/payment/paydunya/route.js
import PaydunyaService from '../../../utils/paydunyaService';

export async function POST(req) {
  const { cartItems, contactInfo, shippingMethod, shippingCost, paymentMethod, total } = await req.json();
  const paydunyaService = new PaydunyaService();

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
      custom_data: {
        contactInfo,
        shippingMethod,
        shippingCost,
        paymentMethod
      }
    };

    const response = await paydunyaService.createInvoice(invoiceData);
    
    if (response.status === 'success' && response.response_text === 'Checkout Invoice Created') {
      return new Response(JSON.stringify({
        success: true,
        redirect_url: response.invoice_url,
        token: response.token
      }), { status: 200 });
    } else {
      throw new Error(response.response_text || 'Failed to create invoice');
    }
  } catch (error) {
    console.error('API Error:', error);
    return new Response(JSON.stringify({ success: false, message: error.message }), { status: 500 });
  }
}