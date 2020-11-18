const express = require("express")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const User = require("../users/UserModel")
const jwt = require("jsonwebtoken")

const jwtSecret = process.env.JWT_SECRET

exports.register = async (req, res) => {
  try {
    //get data from form
    const { fullName, email, password, role, phone, address } = req.body

    //validate input using joi
    const registerData = { fullName, email, password, role, phone, address }
    const schema = Joi.object({
      fullName: Joi.string().required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] }
        })
        .required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
        .required(),
      role: Joi.string(),
      phone: Joi.string().required(),
      address: Joi.string().required()
    })

    const { error, value } = schema.validate(registerData)

    if (error) {
      res.status(400).json({ data: error.details[0].message })
    }

    //check if user exists
    let user = await User.findOne({ email })

    if (user) return res.status(400).json({ data: "User already exists!" })

    //hash password
    user = new User({ ...registerData })
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash(password, salt)
    await user.save()

    //jwt stuff
    const payload = {
      user: {
        id: user._id
      }
    }

    jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err

      res.status(201).json({ data: "account created", token })
    })
  } catch (error) {
    res.status(500).json({ status: "failed", data: "server error" })
  }
}
