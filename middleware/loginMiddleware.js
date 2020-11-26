const Joi = require("joi")
exports.loginMiddleware = async (req, res, next) => {
  //validate inputs

  const { email, password } = req.body

  const schema = Joi.object().keys({
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] }
      })
      .required(),

    password: Joi.string().required()
  })

  const dataToValidate = {
    email,
    password
  }
  const result = schema.validate(dataToValidate)

  const { value, error } = result

  if (error) {
    return res.status(400).json({ data: error.details[0].message })
  }

  next()
}
