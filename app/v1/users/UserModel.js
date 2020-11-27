const mongoose = require("mongoose")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
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
  },
  verified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
})

//hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next()
  }
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

//get password token
UserSchema.methods.getResetPasswordToken = function () {
  //generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex")
  //hash said token and set it to the schema field
  let hash = crypto.createHash("sha256").update(resetToken).digest("hex")
  this.resetPasswordToken = hash

  //set expire to 10 mins
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000

  return resetToken
}
module.exports = mongoose.model("users", UserSchema)
