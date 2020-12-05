const mongoose = require("mongoose")
const { WASHTIMES, WASHTYPES, DELIVERY_METHOD } = require("../../../Constant")

const OrderSchema = mongoose.Schema({
  user_id: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },
  vendor_id: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
  items: {
    type: mongoose.Schema.ObjectId,
    ref: "Garmentorderdetail",
    required: true
  },
  deliveryFee: { type: Number },
  subTotal: { type: Number },
  total: { type: Number },
  washType: {
    type: String,
    enum: WASHTYPES,
    default: "NORMAL WASH"
  },
  washTime: {
    type: String,
    enum: WASHTIMES,
    default: "NORMAL WASH"
  },
  deliveryMethod: {
    type: String,
    enum: DELIVERY_METHOD,
    default: "SELF DROP-OFF"
  },
  dropOffDate: { type: Date, default: Date.now() },
  pickUpDate: { type: Date, default: Date.now()+ 7*24*86400*1000 },
  additionalInfo: { type: String }
})

module.exports = mongoose.model("order", OrderSchema)
