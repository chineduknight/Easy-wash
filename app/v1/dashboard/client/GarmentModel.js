const mongoose = require("mongoose")
const GarmentSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },

  order: {
    type: mongoose.Schema.ObjectId,
    ref: "Orders",
    required: true
  },

  vendorID:{

  }
})

module.exports = mongoose.model("garments", GarmentSchema)
