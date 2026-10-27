const express = require("express");
const configDb = require("./utils/dbConfig");
const cors = require("cors");
let port = process.env.PORT || 4000;
require("dotenv").config();
const app = express();
app.use(cors());
const productRoute = require("./router/productRoute");
const userRoute = require("./router/userRoute");
const cartRoute = require("./router/cartRoute");
const orderRoute = require("./router/orderRoute");
app.use(express.json());
app.get("/no-sql", (req, res) => {
  res.send("server working correctly");
});

app.use("/", productRoute);
app.use("/", userRoute);
app.use("/", cartRoute);
app.use("/", orderRoute)
app.listen(port, () => {
  configDb();
  console.log("server connected");
});
