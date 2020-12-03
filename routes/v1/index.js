const express = require("express")
const router = express.Router()
const { protect } = require("../../middleware/protect")

router.use("/auth", require("./auth"))
router.use("/dashboard", require("./dashboard"))

module.exports = router
