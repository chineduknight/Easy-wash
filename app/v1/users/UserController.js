const express = require("express")
const crypto = require("crypto")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const User = require("../users/UserModel")
const jwt = require("jsonwebtoken")
const Garment = require("../garments/GarmentModel")

exports.addVendorGarment = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (user.role == "USER") {
      return res.status(403).json({
        msg: "You are unauthorized to visit this route"
      })
    }

    const { name, price } = req.body
    const garmentData = { name, price, vendorID: req.user.id }

    //save in the db
    let garment = new Garment({ ...garmentData })
    await garment.save()

    return res.status(201).json({
      msg: "vendor garment added"
    })
  } catch (error) {
    return res.status(500).json({
      msg: "an error occurred"
    })
  }
}
