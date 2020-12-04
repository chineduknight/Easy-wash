const express = require("express")
const router = express.Router()

const userController = require("../../app/v1/users/UserController")

const { protect } = require("../../middleware/protect")

//may need to set user permissions to this route though
router.get("/addgarment", protect, userController.addVendorGarment)

module.exports = router
