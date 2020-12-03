const jwt = require("jsonwebtoken")
const jwtSecret = process.env.JWT_SECRET
exports.protect = async (req, res, next) => {
  try {
    console.log(req.header)
    //get token from header
    const token = req.header("Authorization").split(" ")[1]
    console.log(token)

    //check validity of token
    if (!token) {
      return res.status(403).json({ message: "No token. Authorization denied" })
    }

    const decoded = jwt.verify(token, jwtSecret)
    req.user = decoded.user
    next()
  } catch (error) {
    return res.status(500).json({ message: "Token not valid" })
  }
}
