const mongoose = require("mongoose")
const { ROLES } = require("../../../Constant")

const UserSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: { type: String, enum: ROLES, default: "USER" },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model("users", UserSchema)
