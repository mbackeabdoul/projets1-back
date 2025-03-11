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

// Routes
app.use("/api/auth", require("./routes/auth"))
app.use("/api/products", require("./routes/products"))

// Route de base pour vérifier que le serveur fonctionne
app.get("/", (req, res) => {
  res.send("API is running...")
})

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" })
})

// Dans server.js
app.use('/api/favorites', require('./routes/favorites'));

// Ajoutez cette ligne avec vos autres imports de routes
const paymentRoutes = require('./routes/payments');

// Ajoutez cette ligne avec vos autres app.use pour les routes
app.use('/api/payments', paymentRoutes);
// Port et démarrage du serveur
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`)
})
