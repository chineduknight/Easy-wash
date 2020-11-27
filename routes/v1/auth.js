const express = require("express")
const router = express.Router()
const authController = require("../../app/v1/auth/AuthController")
const { loginMiddleware } = require("../../middleware/loginMiddleware")
const { registerMiddleware } = require("../../middleware/registerMiddleware")
const { protect } = require("../../middleware/protect")

router.post("/register", registerMiddleware, authController.register)
router.post("/login", loginMiddleware, authController.login)
router.get("/verify", authController.verify)
router.post("/resendverification", authController.resendverification)
router.post("/forgotpassword", authController.forgotpassword)
router.put("/resetpassword/:resettoken", authController.resetpassword)

router.get("/me", protect, authController.userprofile)

//Clarify resend verification link
//clarify put request and shit for resetpassword

module.exports = router
