const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userschema = new mongoose.Schema({
  Firstname: {
    required: true,
    type: String,
  },
  Lastname: {
    required: true,
    type: String,
  },
  Username: {
    required: true,
    type: String,
  },

  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    match: [/^[0-9]{10,15}$/, "phone number must be 10 to 15 digits"],
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/@.*\.com$/, "email must be valid"],
  },
});

userschema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const User = mongoose.model("User", userschema);
module.exports = User;
