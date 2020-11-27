const mongoose = require("mongoose")

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })
    console.log("ajibola")
    console.log(
      `MongoDB connected: ${conn.connection.host}`.cyan.underline.bold
    )
  } catch (error) {
    console.log("couldnt connect to the db")
  }

}

module.exports = connectDB
