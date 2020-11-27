const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res
    .status(200)
    .json({ body: "Welcome to eazy clean my guy. Your worries end here" })
})

module.exports = router
