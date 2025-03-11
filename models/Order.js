// const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema({
//   user: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   items: [
//     {
//       product: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'Product',
//         required: true
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 1
//       },
//       price: {
//         type: Number,
//         required: true,
//         min: 0
//       },
//       size: String,
//       color: String
//     }
//   ],
//   shippingAddress: {
//     address: { type: String, required: true },
//     city: { type: String, required: true },
//     postalCode: { type: String, required: true },
//     country: { type: String, required: true }
//   },
//   billingAddress: {
//     address: String,
//     city: String,
//     postalCode: String,
//     country: String
//   },
//   paymentMethod: {
//     type: String,
//     required: true,
//     enum: ['carte', 'paypal', 'stripe']
//   },
//   paymentResult: {
//     id: String,
//     status: String,
//     update_time: String,
//     email_address: String
//   },
//   taxPrice: {
//     type: Number,
//     required: true,
//     default: 0.0
//   },
//   shippingPrice: {
//     type: Number,
//     required: true,
//     default: 0.0
//   },
//   totalAmount: {
//     type: Number,
//     required: true,
//     min: 0
//   },
//   status: {
//     type: String,
//     required: true,
//     enum: ['créée', 'en traitement', 'expédiée', 'livrée', 'annulée'],
//     default: 'créée'
//   },
//   isPaid: {
//     type: Boolean,
//     default: false
//   },
//   paidAt: Date,
//   shippingDate: Date,
//   deliveredAt: Date
// }, {
//   timestamps: true
// });

// module.exports = mongoose.model('Order', orderSchema);