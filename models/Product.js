const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  image: { 
    type: String, 
    default: '' 
  },
  description: { 
    type: String,
    required: true 
  },
  category: { 
    type: String,
    required: true 
  },
  size: { 
    type: String 
  },
  color: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model('Product', productSchema);
