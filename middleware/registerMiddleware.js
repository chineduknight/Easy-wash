const Joi = require("joi")
exports.registerMiddleware = async (req, res, next) => {
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
    return res.status(400).json({ data: error.details[0].message })
  }
  next()
}
