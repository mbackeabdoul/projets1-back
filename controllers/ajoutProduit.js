const Product = require("../models/Product")
const fs = require("fs")
const  cloudinary  = require("../config/cloudnary")

// @desc    Récupérer tous les produits
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({})
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// @desc    Récupérer un produit par ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (product) {
      res.json(product)
    } else {
      res.status(404).json({ message: "Produit non trouvé" })
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// @desc    Créer un nouveau produit
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  console.log("Cloudinary:", cloudinary)
  console.log("🔑 CLOUDINARY SECRET:", process.env.CLOUDINARY_API_SECRET);
  try {
    const { name, price, category, size, color, description } = req.body

    // Vérification des champs obligatoires
    if (!name || !price || !category || !description) {
      return res.status(400).json({ message: "Tous les champs obligatoires doivent être remplis" })
    }

    // Gestion de l'image si elle existe
    let imageUrl = ""
    if (req.file) {
      // Upload sur Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      })
      imageUrl = result.secure_url

      // Supprimer le fichier temporaire
      fs.unlinkSync(req.file.path)
    }

    // Création du produit
    const product = new Product({
      name,
      price,
      category,
      size: size || "",
      color: color || "",
      description,
      image: imageUrl,
    })

    const createdProduct = await product.save()
    res.status(201).json(createdProduct)
  } catch (error) {
    console.error("Erreur lors de la création du produit:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// @desc    Mettre à jour un produit
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const { name, price, category, size, color, description } = req.body

    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" })
    }

    // Mise à jour des champs
    product.name = name || product.name
    product.price = price || product.price
    product.category = category || product.category
    product.size = size !== undefined ? size : product.size
    product.color = color !== undefined ? color : product.color
    product.description = description || product.description

    // Gestion de l'image si elle existe
    if (req.file) {
      // Upload sur Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "products",
      })

      // Supprimer l'ancienne image si elle existe
      if (product.image) {
        // Extraire l'ID public de l'URL Cloudinary
        const publicId = product.image.split("/").pop().split(".")[0]
        await cloudinary.uploader.destroy(`products/${publicId}`)
      }

      product.image = result.secure_url

      // Supprimer le fichier temporaire
      fs.unlinkSync(req.file.path)
    }

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } catch (error) {
    console.error("Erreur lors de la mise à jour du produit:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

// @desc    Supprimer un produit
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" })
    }

    // Supprimer l'image de Cloudinary si elle existe
    if (product.image) {
      // Extraire l'ID public de l'URL Cloudinary
      const publicId = product.image.split("/").pop().split(".")[0]
      await cloudinary.uploader.destroy(`products/${publicId}`)
    }

    await product.deleteOne()
    res.json({ message: "Produit supprimé" })
  } catch (error) {
    console.error("Erreur lors de la suppression du produit:", error)
    res.status(500).json({ message: "Erreur serveur" })
  }
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}

