// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Assurez-vous que votre URI MongoDB est correcte
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Quitter l'application en cas d'échec de connexion
    process.exit(1);
  }
};

module.exports = connectDB;