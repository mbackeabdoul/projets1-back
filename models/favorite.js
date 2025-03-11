// models/favorite.js
const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

// Index composé pour empêcher les doublons
favoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);