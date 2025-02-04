require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
// const bcrypt = require("bcrypt");

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MONGODB");
  })
  .catch((error) => {
    console.log("MONGO_DB ERROR:", error);
  });

const port = process.env.PORT;

app.listen(port, () => {
  console.log("Server is running on port ${port}");
});
