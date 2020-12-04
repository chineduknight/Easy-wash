const express = require("express")
const router = express.Router()

const dashboardController = require("../../app/v1/dashboard/DashboardController")

const { protect } = require("../../middleware/protect")

router.get("/get_vendors/:distance", protect, dashboardController.getVendors)

module.exports = router
  