const express = require("express")
const router = express.Router()
const { register, login,  } = require("../controllers/authController")
const { auth } = require("../middleware/auth")

// Routes publiques
router.post("/register", register)
router.post("/login", login)
// router.post("/forgot-password", forgotPassword)
// router.post("/reset-password", resetPassword)

// Routes protégées
router.get("/profile", auth, (req, res) => {
  res.json({ user: req.user })
})

module.exports = router

