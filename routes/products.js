const express = require("express")
const router = express.Router()
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/ajoutProduit")
const { auth, isAdmin } = require("../middleware/auth")
const { upload } = require("../middleware/upload")

// Routes publiques
router.get("/", getProducts)
router.get("/:id", getProductById)

// Routes protégées (admin seulement)
router.post("/", [  upload.single("image")], createProduct)
router.put("/:id", [auth, isAdmin, upload.single("image")], updateProduct)
router.delete("/:id", [auth, isAdmin], deleteProduct)

module.exports = router

