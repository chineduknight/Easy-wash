const express = require("express")
const router = express.Router()
const authController = require("../../app/v1/auth/AuthController")

router.post("/register", authController.register)

module.exports = router
