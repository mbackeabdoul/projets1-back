// utils/paydunyaService.js
class PaydunyaService {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_PAYDUNYA_API_URL || 'https://app.paydunya.com/api/v1';
    this.masterKey = process.env.PAYDUNYA_MASTER_KEY;
    this.privateKey = process.env.PAYDUNYA_PRIVATE_KEY;
    this.publicKey = process.env.PAYDUNYA_PUBLIC_KEY;
    this.token = process.env.PAYDUNYA_TOKEN;

    // Log pour vérifier les clés
    console.log('PayDunya Config:', {
      baseUrl: this.baseUrl,
      masterKey: this.masterKey ? 'Set' : 'Missing',
      privateKey: this.privateKey ? 'Set' : 'Missing',
      publicKey: this.publicKey ? 'Set' : 'Missing',
      token: this.token ? 'Set' : 'Missing'
    });
  }

  getHeaders() {
    return {
      'PAYDUNYA-MASTER-KEY': this.masterKey,
      'PAYDUNYA-PRIVATE-KEY': this.privateKey,
      'PAYDUNYA-PUBLIC-KEY': this.publicKey,
      'PAYDUNYA-TOKEN': this.token,
      'Content-Type': 'application/json'
    };
  }

  async createInvoice(data) {
    try {
      console.log('Creating PayDunya invoice with data:', JSON.stringify(data, null, 2));
      const response = await fetch(`${this.baseUrl}/checkout-invoice/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      const responseData = await response.json();
      console.log('PayDunya Response Status:', response.status);
      console.log('PayDunya Response Data:', JSON.stringify(responseData, null, 2));

      if (!response.ok) {
        throw new Error(`PayDunya API error: ${response.status} - ${responseData.message || 'Unknown error'}`);
      }

      return responseData;
    } catch (error) {
      console.error('Error creating PayDunya invoice:', error);
      throw error;
    }
  }
}

module.exports = PaydunyaService; // Exportation correcte