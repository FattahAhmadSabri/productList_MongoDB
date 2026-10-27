const mongoose = require("mongoose");

const configDb = async () => {
  try {
    const config = await mongoose.connect(process.env.MONGO_URI);
    console.log("db connected");
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

module.exports = configDb;
