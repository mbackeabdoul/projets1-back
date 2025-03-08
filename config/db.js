const mongoose = require('mongoose');
const User = require('../models/User'); // Importe le modèle User

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Vérifier et créer un admin par défaut
    await createDefaultAdmin();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

// Fonction pour créer un admin par défaut
const createDefaultAdmin = async () => {
  try {
    const adminEmail = 'admin@example.com'; // Email de l'admin par défaut
    const existingAdmin = await User.findOne({ email: adminEmail });

    if (!existingAdmin) {
      const admin = new User({
        prenom: 'Admin',
        nom: 'User',
        email: adminEmail,
        password: 'admin123', 
        role: 'admin' 
      });
      await admin.save();
      console.log('Admin par défaut créé avec succès');
    } else {
      console.log('Admin par défaut existe déjà');
    }
  } catch (error) {
    console.error('Erreur lors de la création de l’admin par défaut:', error);
  }
};

module.exports = connectDB;