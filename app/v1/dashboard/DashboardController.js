const express = require("express")
const crypto = require("crypto")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const User = require("../users/UserModel")
const jwt = require("jsonwebtoken")
const { sendEmail } = require("../../../utils/emails/sendEmail")
const { Console } = require("console")
const { protect } = require("../../../middleware/protect")
const geocoder = require("../../../utils/geoCoder")

const jwtSecret = process.env.JWT_SECRET

exports.getVendors = async (req, res) => {
  try {
    const { distance } = req.params
    const user = await User.findById(req.user.id)
    let zipcode = user.location.zipcode

    //consider if no zipcode, return all vendors
    if (!zipcode.length) {
      const vendors = await User.find({ role: "VENDOR" }).select(
        "-password -location -phone"
      )
      return res.status(200).json({
        success: true,
        msg: "zipcode not found, returning all vendors",
        count: vendors.length,
        data: vendors
      })
    }

    const loc = await geocoder.geocode(zipcode)

    const lat = loc[0].latitude
    const lng = loc[0].longitude

    //divide distance by radius of earth
    //radius of earth = 6378 km
    const radius = distance / 6378

    const vendors = await User.find({
      location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
      role: "VENDOR"
    }).select("-password -location -phone")

    return res
      .status(200)
      .json({ success: true, count: vendors.length, data: vendors })
  } catch (error) {
    res.status(500).json({ msg: "an error occurred" })
  }
}
