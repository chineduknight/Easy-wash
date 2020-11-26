const express = require("express")
const crypto = require("crypto")
const Joi = require("joi")
const bcrypt = require("bcrypt")
const User = require("../users/UserModel")
const jwt = require("jsonwebtoken")
const { sendEmail } = require("../../../utils/emails/sendEmail")
const { Console } = require("console")

const jwtSecret = process.env.JWT_SECRET

exports.register = async (req, res) => {
  try {
    //get data from form
    const { fullName, email, password, role, phone, address } = req.body

    const registerData = { fullName, email, password, role, phone, address }
    const callbackURL = req.body.callbackURL

    //check if user exists
    let user1 = await User.findOne({ email })
    if (user1) return res.status(400).json({ data: "User already exists!" })

    //hash password
    const user = await User.create({ ...registerData })
    //password hashed in a middleware function in User.js

    // const salt = await bcrypt.genSalt(10)
    // user.password = await bcrypt.hash(password, salt)
    //await user.save()
    console.log("ajiollllll")
    //jwt stuff
    const payload = {
      user: {
        id: user._id
      }
    }

    jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, async (err, token) => {
      if (err) throw err

      let link = `${callbackURL}?email=${email}&token=${token}`
      //send email
      let message = {
        from: '"Eazy Clean Laundry" <shodipoajibola@gmail.com>',
        to: email,
        subject: "Please Complete your Registration",
        text: `Hello ${fullName}, \n Please click on the link below to finalize your registration \n ${link}`
      }

      await sendEmail(message)

      res
        .status(201)
        .json({ data: `An email has been sent to ${email}`, token })
    })
  } catch (error) {
    res.status(500).json({ status: "failed", data: error })
  }
}

exports.login = async (req, res) => {
  //find user in db
  try {
    let { email, password } = req.body
    let user = await User.findOne({ email })

    //find email in db
    if (!user) {
      return res.status(401).json({ data: "Invalid credentials" })
    }

    if (!user.verified) {
      return res
        .status(403)
        .json({ status: "failed", data: "Please verify your email address" })
    }

    //compare password
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" })
    }

    //jwt stuff
    const payload = {
      user: {
        id: user._id
      }
    }

    jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err

      res.status(201).json({ data: "login succesful", token })
    })
  } catch (error) {
    res.status(500).json({ status: "failed", data: "server error" })
  }
}

exports.verify = async (req, res) => {
  try {
    const { email, token } = req.query
    const decoded = jwt.verify(token, jwtSecret)
    let user = await User.findById(decoded.user.id)
    if (email !== user.email) {
      return res.status(400).json({ status: "failed", verified: false })
    }

    //update user model
    await User.findOneAndUpdate(
      { _id: decoded.user.id },
      { verified: true },
      { new: true }
    )
    return res.status(200).json({ status: "success", verified: true })
  } catch (error) {
    return res.status(500).json({ status: "failed", data: error })
  }
}

exports.forgotpassword = async (req, res) => {
  //find user by email
  const { email, callbackURL } = req.body
  const user = await User.findOne({ email })

  if (!user) {
    return res.status(404).json({ message: "Email does not exist" })
  }
  try {
    //get reset token from db schema method
    const resetToken = user.getResetPasswordToken()

    //save details to db
    await user.save()

    //create reset url
    const resetUrl = `${callbackURL}/${resetToken}`

    //send email
    let message = {
      from: '"Eazy Clean Laundry" <shodipoajibola@gmail.com>',
      to: email,
      subject: "Password Reset",
      text: `Please click on the link below to reset your password \n ${resetUrl}`
    }

    await sendEmail(message)
    return res.status(200).json({ status: "email sent" })
  } catch (error) {
    //should error exist, do not update db with curent values
    user.getResetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()
    return res.status(500).json({ status: "failed", data: error })
  }
}

exports.resetpassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.resettoken)
      .digest("hex")
    //then find user by above token. also make sure that the time is not exceeded
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    })

    console.log(user)
    if (!user) {
      return res.status(400).json({ status: "failed", data: "invalid token" })
    }

    //update db accordingly
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined
    await user.save()

    return res
      .status(200)
      .json({ status: "success", data: "password reset successfully" })
  } catch (error) {
    return res.status(500).json({ status: "failed", data: "An error occurred" })
  }
}

exports.resendverification = async (req, res) => {
  //because this route needs the email, it is imperative for login to have been initiated before this route is exposed to the frontend
  try {
    let { email, callbackURL } = req.body
    //find email from db
    const user = await User.findOne({ email })

    console.log(user)
    if (!user) {
      return res.status(400).json({ data: "email does not exist" })
    }

    const payload = {
      user: {
        id: user._id
      }
    }
    jwt.sign(payload, jwtSecret, { expiresIn: 360000 }, async (err, token) => {
      if (err) throw err

      let link = `${callbackURL}?email=${email}&token=${token}`
      //send email
      let message = {
        from: '"Eazy Clean Laundry" <shodipoajibola@gmail.com>',
        to: email,
        subject: "Please Complete your Registration",
        text: `Hello \n Please click on the link below to finalize your registration \n ${link}`
      }

      await sendEmail(message)

      res
        .status(201)
        .json({ data: `An email has been RESENT to ${email}`, token })
    })
  } catch (error) {
    return res.status(500).json({ status: "failed", data: "An error occurred" })
  }
}

exports.userprofile = async (req, res) => {
  console.log(req.user)
  const user = await User.findById(req.user.id).select("-password")

  return res.status(200).json({
    data: user
  })
}
