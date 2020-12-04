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

  vendorID: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
})

module.exports = mongoose.model("garment", GarmentSchema)
