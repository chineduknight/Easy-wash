const mongoose = require("mongoose")
const crypto = require("crypto")
const bcrypt = require("bcrypt")
const geocoder = require("../../../utils/geoCoder")
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
  location: {
    // GeoJSON Point
    type: {
      type: String,
      enum: ["Point"]
    },
    coordinates: {
      type: [Number],
      index: "2dsphere"
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
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

// Geocode & create location field
UserSchema.pre("save", async function (next) {
  const loc = await geocoder.geocode(this.address)
  this.location = {
    type: "Point",
    coordinates: [loc[0].longitude, loc[0].latitude],
    formattedAddress: loc[0].formattedAddress,
    street: loc[0].streetName,
    city: loc[0].city,
    state: loc[0].stateCode,
    zipcode: loc[0].zipcode,
    country: loc[0].countryCode
  }

  // Do not save address in DB
  // this.address = undefined
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
