const mongoose = require("mongoose")
const GarmentOrderDetailSchema = mongoose.Schema({
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
  // orderID: {
  //   type: mongoose.Schema.ObjectId,
  //   ref: "Order",
  //   required: true
  // },
})

module.exports = mongoose.model("garmentorderdetail", GarmentOrderDetailSchema)
