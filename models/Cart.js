// const mongoose = require('mongoose');

// const cartItemSchema = new mongoose.Schema({
//   productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
//   name: { type: String, required: true },
//   color: { type: String },
//   size: { type: String },
//   price: { type: Number, required: true },
//   quantity: { type: Number, required: true, min: 1 },
//   image: { type: String },
// });

// const cartSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   items: [cartItemSchema],
//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model('Cart', cartSchema);