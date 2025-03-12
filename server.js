const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")
const path = require("path")
require("dotenv").config()

// Initialisation de l'application Express
const app = express()

// Connexion à la base de données
connectDB()

// Middleware
app.use(express.json())
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Dossier statique pour les uploads (si nécessaire)
app.use("/upload", express.static(path.join(__dirname, "upload")))

// Importation des routes
// const cartRoutes = require('./routes/cart');
const paymentRoutes = require('./routes/payments');
// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/products", require("./routes/products"))
<<<<<<< HEAD
// app.use('/api/cart', cartRoutes);
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/payments', paymentRoutes);
=======
app.use('/api/favorites', require('./routes/favorites'));
>>>>>>> 83bfd30613a2300cd01198077308fd6e6b04ecf9

// Route de base pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.send("API is running...")
})

// Gestion des erreurs 404 (à placer après toutes les routes)
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

<<<<<<< HEAD
=======
// Dans server.js

// Ajoutez cette ligne avec vos autres imports de routes
const paymentRoutes = require('./routes/payments');

// Ajoutez cette ligne avec vos autres app.use pour les routes
app.use('/api/payments', paymentRoutes);
>>>>>>> 83bfd30613a2300cd01198077308fd6e6b04ecf9
// Port et démarrage du serveur
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})