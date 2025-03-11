// utils/paydunyaService.js
class PaydunyaService {
  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_PAYDUNYA_API_URL || 'https://app.paydunya.com/api/v1';
    this.masterKey = process.env.PAYDUNYA_MASTER_KEY || 'XuujCrAi-w5E0-ikK9-DCQ0-gHK2Iv5DxMbR';
    this.privateKey = process.env.PAYDUNYA_PRIVATE_KEY || 'test_private_kWtjrEwJzg9IGWCHpzHCLegbKkR';
    this.publicKey = process.env.PAYDUNYA_PUBLIC_KEY || 'test_public_XALAp5YR0goLypVeo89NxZkxjeO';
    this.token = process.env.PAYDUNYA_TOKEN || 'alFEWH7gfGwHxXZmKza7';
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
      const response = await fetch(`${this.baseUrl}/checkout-invoice/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creating PayDunya invoice:', error);
      throw error;
    }
  }
  
  async checkInvoiceStatus(token) {
    try {
      const response = await fetch(`${this.baseUrl}/checkout-invoice/confirm/${token}`, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error checking PayDunya invoice status:', error);
      throw error;
    }
  }
  
  async getTransactions(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${this.baseUrl}/transactions?${queryString}` : `${this.baseUrl}/transactions`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders()
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching PayDunya transactions:', error);
      throw error;
    }
  }
}
module.exports = PaydunyaService;