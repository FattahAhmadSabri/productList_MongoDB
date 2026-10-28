const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    mobile : {
        type : String
    },
    password: {
        type : String
    },
   role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
}
})

const User = mongoose.model("user", userSchema)

module.exports = User