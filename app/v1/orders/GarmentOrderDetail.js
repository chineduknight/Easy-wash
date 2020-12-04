const mongoose = require("mongoose")
const GarmentOrderDetailSchema = mongoose.Schema({
  orderID: {
    type: mongoose.Schema.ObjectId,
    ref: "Order",
    required: true
  },
  details: [
    {
      name: {
        type: String,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }
  ]

  //   vendorID: {}
})

module.exports = mongoose.model("garmentorderdetail", GarmentOrderDetailSchema)
