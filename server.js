const express = require("express")
const dotenv = require("dotenv")
const connectDB = require("./config/db")
const colors = require("colors")

//Load env variables
dotenv.config({ path: "./config/config.env" })

//connect to Database
connectDB()

const app = express()

//Body Parser
app.use(express.json())
const PORT = process.env.PORT || 5000

const server = app.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT} `.yellow
      .bold
  )
)


