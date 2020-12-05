const express = require("express")
const crypto = require("crypto")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const User = require("../users/UserModel")
const GarmentOrderDetail = require("../orders/GarmentOrderDetailModel")
const Order = require("../orders/OrderModel")
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

exports.newOrder = async (req, res) => {
  try {
    //asssume data is an array of objects. data comes in as json so it has to be parsed back to js
    const trial = [
      { name: "Shirt", price: 500, quantity: 3 },
      { name: "Shirt", price: 500, quantity: 3 },
      { name: "Shirt", price: 500, quantity: 3 }
    ]
    const {
      data = trial,
      vendor_id,
      deliveryFee,
      subTotal,
      total,
      washType,
      washTime,
      deliveryMethod,
      dropOffDate,
      pickUpDate,
      additionalInfo
    } = req.body
    let user_id = req.user.id

    let garmentOrder = new GarmentOrderDetail({ details: data })
    await garmentOrder.save()
    console.log(garmentOrder)

    let orderData = {
      user_id,
      items: garmentOrder._id,
      vendor_id,
      deliveryFee,
      subTotal,
      total,
      washType,
      washTime,
      deliveryMethod,
      dropOffDate,
      pickUpDate,
      additionalInfo
    }

    console.log(orderData)
    let order = new Order({ ...orderData })
    await order.save()
    res.status(200).json({
      msg: "order received",
      data: order
    })
  } catch (error) {
    res.status(500).json({ msg: "an error occurred", error:error })
  }
}
