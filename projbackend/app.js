const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
//my routes
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const categoryRoutes = require("./routes/category");
const productRoutes = require("./routes/product");
const orderRoutes = require("./routes/order");
const paymentBRoutes = require("./routes/paymentBRoutes");

require("dotenv").config();
//db connection
mongoose.connect(process.env.DATABASE).then(() => {
  console.log("DB CONNECTED");
});
//middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
//routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", paymentBRoutes);

//port
const port = process.env.PORT || 8000;
//starting server
app.listen(port, () => {
  console.log(`App is running at ${port}`);
});
