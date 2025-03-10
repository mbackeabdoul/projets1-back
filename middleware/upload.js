const multer = require("multer")
const path = require("path")
const fs = require("fs")

// Créer le dossier upload s'il n'existe pas
const uploadDir = "upload"
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir)
}

// Configuration du stockage temporaire avec Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir) // Stockage temporaire avant upload sur Cloudinary
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "-")}`) // Nom unique pour éviter les conflits
  },
})

// Vérification du type de fichier (seulement les images)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Seuls les fichiers images sont autorisés !"), false)
  }
}

// Middleware Multer pour gérer l'upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limite à 5 Mo par fichier
})

module.exports = { upload }

