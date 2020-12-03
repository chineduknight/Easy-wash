const express = require("express")
const router = express.Router()

router.use("/auth", require("./auth"))
router.use("/dashboard", protect, require("./dashboard"))



module.exports = router
